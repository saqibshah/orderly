import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";
import Papa, { ParseResult } from "papaparse";
import * as XLSX from "xlsx";

// --------------------------------------------------
// TYPES
// --------------------------------------------------
type Courier = "postex" | "trax";

interface PostExRow {
  TRACKING_NUMBER?: string | number;
  COD_AMOUNT?: string | number;
  NET_AMOUNT?: string | number;
  STATUS?: string;
}

interface TraxRow {
  "Tracking No."?: string | number;
  "Net Disbursement Amount (PKR)\n"?: string | number;
  "Collection Amount (PKR)"?: string | number;
  Type?: string;
}

interface NormalizedRow {
  tracking: string;
  status: string;
  payment: number;
  charges: number;
}

interface SkippedRow {
  tracking: string;
  status: string;
  message: string;
}

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const cleanNumber = (value: unknown): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  return Number(String(value).replace(/,/g, ""));
};

const isPostExRow = (row: PostExRow | TraxRow): row is PostExRow => {
  return "TRACKING_NUMBER" in row;
};

const isTraxRow = (row: PostExRow | TraxRow): row is TraxRow => {
  return "Tracking No." in row;
};

const hasTracking = (row: PostExRow | TraxRow, courier: "postex" | "trax") => {
  if (courier === "postex" && isPostExRow(row)) {
    return Boolean(row.TRACKING_NUMBER);
  }
  if (courier === "trax" && isTraxRow(row)) {
    return Boolean(row["Tracking No."]);
  }
  return false;
};

// --------------------------------------------------
// NORMALIZERS
// --------------------------------------------------

const normalizePostEx = (row: PostExRow): NormalizedRow => {
  const cod = cleanNumber(row.COD_AMOUNT);
  const net = cleanNumber(row.NET_AMOUNT);

  const isDelivered = row.STATUS === "Delivered";
  const isReturn = row.STATUS === "Return";

  const charges = isReturn ? Math.abs(net) : Number((cod - net).toFixed(2));
  const payment = isDelivered ? cod : 0;

  return {
    tracking: String(row.TRACKING_NUMBER ?? ""),
    status: isReturn ? "Returned" : row.STATUS ?? "",
    payment,
    charges,
  };
};

const normalizeTrax = (row: TraxRow): NormalizedRow => {
  const net = cleanNumber(row["Net Disbursement Amount (PKR)\n"]);
  const cod = cleanNumber(row["Collection Amount (PKR)"]);

  const isDelivered = row.Type === "Delivered";
  const isArrival = row.Type === "Arrival";

  const charges = isArrival ? Math.abs(net) : Number((cod - net).toFixed(2));
  const payment = isDelivered ? cod : 0;

  return {
    tracking: String(row["Tracking No."] ?? ""),
    status: row.Type ?? "",
    payment,
    charges,
  };
};

// --------------------------------------------------
// API ROUTE
// --------------------------------------------------

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const courier = formData.get("courier") as Courier;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // --------------------------------------------------
    // READ FILE (TYPED)
    // --------------------------------------------------
    let rawData: (PostExRow | TraxRow)[] = [];

    if (file.name.endsWith(".csv")) {
      const text = await file.text();
      const parsed: ParseResult<PostExRow | TraxRow> = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
      });
      rawData = parsed.data;
    } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rawData = XLSX.utils.sheet_to_json<PostExRow | TraxRow>(sheet);
    } else {
      return NextResponse.json(
        { error: "Unsupported file format. Upload CSV/XLSX." },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // NORMALIZE DATA
    // --------------------------------------------------
    const normalized: NormalizedRow[] = rawData
      .filter((row) => hasTracking(row, courier))
      .map((row) => {
        if (courier === "postex" && isPostExRow(row)) {
          return normalizePostEx(row);
        }
        if (courier === "trax" && isTraxRow(row)) {
          return normalizeTrax(row);
        }
        throw new Error("Invalid row structure for courier " + courier);
      });

    // --------------------------------------------------
    // PROCESS EACH SHIPMENT
    // --------------------------------------------------
    const skippedRows: SkippedRow[] = [];

    for (const row of normalized) {
      const { tracking, status } = row;

      if (!tracking || !status) continue;

      const order = await prisma.order.findUnique({
        where: { tracking },
      });

      if (!order) {
        skippedRows.push({ tracking, status, message: "Order not found" });
        continue;
      }

      if (order.statusesApplied.includes(status)) {
        skippedRows.push({ tracking, status, message: "Already Applied" });
        continue;
      }

      const updatedData: Record<string, unknown> = {};

      // Apply logic
      if (status === "Arrival") {
        updatedData.courierDeliveryCharge =
          order.courierDeliveryCharge + row.charges;
      }

      if (status === "Delivered") {
        const totalCharges = order.courierDeliveryCharge + row.charges;

        updatedData.courierDeliveryCharge = totalCharges;
        updatedData.courierPaid = row.payment - totalCharges;
        updatedData.courierPaymentStatus = "Paid";
      }

      if (status === "Returned") {
        updatedData.courierPaid = 0;
        updatedData.courierPaymentStatus = "No Payment";
        updatedData.courierDeliveryCharge =
          order.courierDeliveryCharge + row.charges;
      }

      updatedData.statusesApplied = { push: status };

      await prisma.order.update({
        where: { tracking },
        data: updatedData,
      });
    }

    return NextResponse.json({
      message: `Processed ${normalized.length} rows safely.`,
      skipped: skippedRows,
    });
  } catch (err) {
    console.error(err);
    const e = err as Error;
    return NextResponse.json(
      { error: e.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
