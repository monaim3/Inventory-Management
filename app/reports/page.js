async function getReports() {
  const data = await fetch("http://localhost:3000/api/reports", {
    cache: "no-store",
  }).then((r) => r.json());
  return data;
}

const badge = (type) => ({
  background: type === "IN" ? "#e8f5e9" : "#ffebee",
  color: type === "IN" ? "#2e7d32" : "#c62828",
  padding: "3px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "700",
});

export default async function ReportsPage() {
  const { leftJoin, rightJoin, stockHistory } = await getReports();

  const Section = ({ title, subtitle, color, children }) => (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: "0 2px 12px rgba(9,99,126,0.08)",
        borderTop: `4px solid ${color}`,
      }}
    >
      <h2 style={{ fontWeight: "700", color, marginBottom: "4px" }}>{title}</h2>
      <code
        style={{
          fontSize: "11px",
          color: "#999",
          display: "block",
          marginBottom: "16px",
          background: "#f5f5f5",
          padding: "6px 10px",
          borderRadius: "6px",
        }}
      >
        {subtitle}
      </code>
      {children}
    </div>
  );

  const Th = ({ children }) => (
    <th
      style={{
        textAlign: "left",
        padding: "10px 14px",
        color: "#088395",
        fontWeight: "600",
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}
    >
      {children}
    </th>
  );

  const Td = ({ children }) => (
    <td
      style={{
        padding: "12px 14px",
        color: "#555",
        borderBottom: "1px solid #f0f7f8",
      }}
    >
      {children}
    </td>
  );

  return (
    <div>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "800",
          color: "#09637E",
          marginBottom: "8px",
        }}
      >
        Reports
      </h1>
      <p style={{ color: "#7AB2B2", marginBottom: "28px", fontSize: "14px" }}>
        SQL JOIN queries and analytics
      </p>

      <Section
        title="LEFT JOIN — Products with Categories"
        subtitle="SELECT p.*, c.name FROM products p LEFT JOIN categories c ON p.category_id = c.id"
        color="#09637E"
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr style={{ background: "#EBF4F6" }}>
              <Th>Product</Th>
              <Th>Price</Th>
              <Th>Quantity</Th>
              <Th>Category</Th>
            </tr>
          </thead>
          <tbody>
            {leftJoin.map((row, i) => (
              <tr key={i}>
                <Td>
                  <strong style={{ color: "#09637E" }}>
                    {row.product_name}
                  </strong>
                </Td>
                <Td>৳{row.price}</Td>
                <Td>{row.quantity}</Td>
                <Td>
                  {row.category_name || (
                    <span style={{ color: "#ccc" }}>NULL</span>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section
        title="RIGHT JOIN — All Suppliers with Products"
        subtitle="SELECT s.*, p.name FROM products p RIGHT JOIN suppliers s ON p.supplier_id = s.id"
        color="#088395"
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr style={{ background: "#EBF4F6" }}>
              <Th>Supplier</Th>
              <Th>Phone</Th>
              <Th>Product</Th>
              <Th>Quantity</Th>
            </tr>
          </thead>
          <tbody>
            {rightJoin.map((row, i) => (
              <tr key={i}>
                <Td>
                  <strong style={{ color: "#088395" }}>
                    {row.supplier_name}
                  </strong>
                </Td>
                <Td>{row.phone}</Td>
                <Td>
                  {row.product_name || (
                    <span style={{ color: "#ccc" }}>NULL</span>
                  )}
                </Td>
                <Td>
                  {row.quantity ?? <span style={{ color: "#ccc" }}>NULL</span>}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section
        title="Stock Transaction History"
        subtitle="SELECT p.name, t.* FROM stock_transactions t LEFT JOIN products p ON t.product_id = p.id"
        color="#7AB2B2"
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr style={{ background: "#EBF4F6" }}>
              <Th>Product</Th>
              <Th>Type</Th>
              <Th>Quantity</Th>
              <Th>Note</Th>
            </tr>
          </thead>
          <tbody>
            {stockHistory.map((row, i) => (
              <tr key={i}>
                <Td>
                  <strong style={{ color: "#09637E" }}>
                    {row.product_name}
                  </strong>
                </Td>
                <td
                  style={{
                    padding: "12px 14px",
                    borderBottom: "1px solid #f0f7f8",
                  }}
                >
                  <span style={badge(row.type)}>{row.type}</span>
                </td>
                <Td>{row.quantity}</Td>
                <Td>{row.note}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}
