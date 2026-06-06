import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer"
import { Download } from "lucide-react"
import { ORG } from "@/constants/org"

const rs = (n) => "INR " + Math.round(Number(n) || 0).toLocaleString("en-IN")
const fmtDate = (v) => (v ? new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-")

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, color: "#1b1b2f", fontFamily: "Helvetica" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  brand: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#4F46E5" },
  muted: { color: "#6b7280" },
  title: { fontSize: 18, fontFamily: "Helvetica-Bold" },
  divider: { borderBottomWidth: 1, borderBottomColor: "#EAECF6", marginVertical: 14 },
  label: { fontSize: 8, color: "#6b7280", textTransform: "uppercase", marginBottom: 2 },
  bold: { fontFamily: "Helvetica-Bold" },
  th: { backgroundColor: "#EEF0FB", padding: 6, fontFamily: "Helvetica-Bold", fontSize: 9 },
  td: { padding: 6, borderBottomWidth: 1, borderBottomColor: "#EAECF6", fontSize: 9 },
  totalsBox: { marginTop: 14, marginLeft: "auto", width: 220 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  grand: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#1b1b2f", paddingTop: 4, marginTop: 4 },
})

function InvoicePdfDoc({ invoice }) {
  const vendor = invoice.vendor || {}
  const po = invoice.purchaseOrder
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.brand}>VendorBridge</Text>
            <Text style={[styles.muted, { marginTop: 4 }]}>{ORG.address}</Text>
            <Text style={styles.muted}>GSTIN: {ORG.gstin}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.title}>Tax Invoice</Text>
            <Text style={styles.muted}>{invoice.invoiceNumber}</Text>
            <Text style={[styles.muted, { marginTop: 2 }]}>Status: {invoice.status}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.rowBetween}>
          <View style={{ width: "48%" }}>
            <Text style={styles.label}>Bill To</Text>
            <Text style={styles.bold}>{ORG.name}</Text>
            <Text style={styles.muted}>{ORG.address}</Text>
            <Text style={styles.muted}>GSTIN: {ORG.gstin}</Text>
          </View>
          <View style={{ width: "48%" }}>
            <Text style={styles.label}>Vendor</Text>
            <Text style={styles.bold}>{vendor.name}</Text>
            <Text style={styles.muted}>{vendor.address || "-"}</Text>
            <Text style={styles.muted}>GSTIN: {vendor.gstNo || "-"}</Text>
          </View>
        </View>

        <View style={[styles.rowBetween, { marginTop: 14 }]}>
          <View>
            <Text style={styles.label}>PO Number</Text>
            <Text>{po?.poNumber || "-"}</Text>
          </View>
          <View>
            <Text style={styles.label}>Invoice Date</Text>
            <Text>{fmtDate(invoice.invoiceDate)}</Text>
          </View>
          <View>
            <Text style={styles.label}>Due Date</Text>
            <Text>{fmtDate(invoice.dueDate)}</Text>
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.th, { flex: 3 }]}>Item</Text>
            <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>Qty</Text>
            <Text style={[styles.th, { flex: 1.4, textAlign: "right" }]}>Unit Price</Text>
            <Text style={[styles.th, { flex: 1.4, textAlign: "right" }]}>Amount</Text>
          </View>
          {(invoice.items || []).map((it) => (
            <View key={it.id} style={{ flexDirection: "row" }}>
              <Text style={[styles.td, { flex: 3 }]}>{it.name}</Text>
              <Text style={[styles.td, { flex: 1, textAlign: "right" }]}>{it.quantity}</Text>
              <Text style={[styles.td, { flex: 1.4, textAlign: "right" }]}>{rs(it.unitPrice)}</Text>
              <Text style={[styles.td, { flex: 1.4, textAlign: "right" }]}>{rs(it.total)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text style={styles.muted}>Subtotal</Text>
            <Text>{rs(invoice.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.muted}>CGST (9%)</Text>
            <Text>{rs(invoice.cgst)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.muted}>SGST (9%)</Text>
            <Text>{rs(invoice.sgst)}</Text>
          </View>
          <View style={styles.grand}>
            <Text style={styles.bold}>Grand Total</Text>
            <Text style={styles.bold}>{rs(invoice.total)}</Text>
          </View>
        </View>

        <Text style={[styles.muted, { marginTop: 28, fontSize: 8 }]}>This is a computer-generated invoice.</Text>
      </Page>
    </Document>
  )
}

export function InvoiceDownloadButton({ invoice }) {
  return (
    <PDFDownloadLink
      document={<InvoicePdfDoc invoice={invoice} />}
      fileName={`${invoice.invoiceNumber}.pdf`}
      className="inline-flex h-10 items-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent"
    >
      {({ loading }) => (
        <>
          <Download className="h-4 w-4" />
          {loading ? "Preparing..." : "Download PDF"}
        </>
      )}
    </PDFDownloadLink>
  )
}
