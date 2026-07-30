# E-commerce Profit Intelligence & Reconciliation Excel Toolkit

![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Browser%20%2B%20Excel-success)
![Tool](https://img.shields.io/badge/Tool-Decision%20Support-orange)

**Analyze true order-level profitability across multiple sales channels, currencies, shipping models, and payout systems—directly in the browser or Excel, with no installation, no signup, and no manual calculations.**

> ## **No signup. No installation. Free.**
>
> 🌐 **Open in Browser**  
> HTML Live Demo *(Coming Soon)*
>
> 📥 **Download Excel**  
> [*google doc view*](https://docs.google.com/spreadsheets/d/1B3V8OhV7BKFgfmOSKyl8jBB-Peb8NxRZLX22Qpb5T28/edit?usp=sharing)
>
> [*excel template purchase*]()

---

# Screenshots

### Browser Version

<!-- screenshot: browser version -->

*Interactive browser interface showing order-level profitability, reconciliation status, shipping confidence, and executive KPIs without requiring spreadsheet software.*

### Excel Version

<!-- screenshot: excel version -->

*Excel workbook with structured data inputs, automated calculation engine, reconciliation workspace, and management dashboard powered by modern dynamic array formulas.*

---

# What It Helps You Track

- True order-level profit after shipping, payment fees, marketplace commissions, VAT, refunds, and product costs.
- Historical profitability that remains accurate even when supplier costs, exchange rates, or platform fees change later.
- Shipping cost confidence by distinguishing actual logistics invoices from progressively estimated shipping scenarios.
- Financial reconciliation across orders, payouts, logistics invoices, and banking records before discrepancies become accounting problems.
- Margin trends by marketplace, country, currency, SKU, or fulfillment strategy using one consistent financial model.
- Orders that appear profitable on the surface but are actually losing money because of hidden operational costs.

---

# Quick Start Workflow

1. **Configure business parameters once**

   Open the **Parameters** sheets and define the operating assumptions that rarely change, including base currency, default VAT rate, reconciliation tolerance, payment fee defaults, and historical rate tables. These settings become the single source of truth for every subsequent calculation without requiring repeated adjustments.

2. **Import existing operational data**

   Export orders, payouts, logistics invoices, refunds, and advertising spend from Shopify, Amazon, bol.com, accounting software, or any existing spreadsheet. Paste each dataset into its designated input sheet without rebuilding formulas or restructuring the workbook.

3. **Review profitability immediately**

   Switch to the calculation engine or executive dashboard. Order-level profit, historical cost matching, shipping allocation, reconciliation status, and management KPIs update automatically, providing operational visibility within minutes instead of hours.

4. **Refresh periodically**

   Repeat the import process weekly, monthly, or whenever new operational data becomes available. Historical calculations remain unchanged while new transactions automatically participate in the same analytical framework.

**Set a few key parameters. Drop in existing data. Get the analysis. Refresh whenever new business data arrives.**

---

# Why I Built This

Many e-commerce businesses believe they already know their profit because every platform provides revenue reports, payout summaries, advertising dashboards, and accounting exports.

The problem is that these reports rarely agree with each other.

Shipping may be charged per shipment rather than per product. Supplier costs change throughout the year. Exchange rates fluctuate daily. Payment providers deduct different fees. Refunds happen weeks after the original sale. Marketplace commissions depend on category and country. When each system measures only one piece of the business, profitability becomes an approximation rather than an auditable financial result.

I built this toolkit after repeatedly seeing businesses make operational decisions using numbers that were internally consistent but financially incorrect.

For example, a bundle containing one primary product and two accessories might appear to generate a **$28 profit** if shipping is allocated equally across products and current supplier costs are applied to historical orders.

After reconstructing the same transaction using historical purchase costs, shipment-level freight allocation, actual payment deductions, and refund attribution, the real profit may only be **$8**.

Nothing changed about the order.

Only the analytical model changed.

That difference directly influences pricing decisions, advertising budgets, supplier negotiations, and inventory purchasing.

Rather than creating another reporting dashboard, this workbook packages a reusable financial reasoning framework into an operational Excel toolkit. The objective is not to produce more reports—it is to make business decisions using numbers that reflect how money actually moved through the business.

---
# Common E-commerce Profitability Problems This Solves

| Problem | Without This Toolkit | With This Toolkit |
|----------|----------------------|-------------------|
| Shipping cost is allocated equally across every SKU | High-margin products subsidize low-margin products, creating misleading profitability rankings. | Shipping follows a structured allocation hierarchy that prioritizes actual logistics invoices before falling back to validated estimation methods. |
| Historical profits change whenever supplier costs are updated | Previous months become impossible to compare because old orders inherit today's costs. | Every order is evaluated using the cost, exchange rate, and fee schedule that was valid on the transaction date. |
| Marketplace payouts never reconcile with internal reports | Finance teams manually investigate discrepancies across several independent systems. | Orders, payouts, logistics invoices, and reconciliation results are connected through one consistent financial model. |
| Bundle products appear unusually profitable | Free gifts, accessories, and bundled components hide their true procurement cost. | Bundle rules allocate procurement costs back to the complete order before profitability is calculated. |
| Multiple currencies distort management reporting | Revenue, logistics, and procurement are compared using inconsistent exchange rates. | Every financial component is normalized through historical point-in-time exchange rates into a single reporting currency. |
| Refunds distort current-period performance | Refunds reduce profit only when they occur instead of correcting the original sale. | Refunds are attributed back to the originating order, preserving accurate historical profitability and trend analysis. |

---

# Who This Is For

This toolkit is designed for professionals who need reliable profitability analysis without implementing a large ERP or business intelligence platform.

Typical users include:

- E-commerce founders managing multiple sales channels.
- Finance managers responsible for operational profitability.
- Marketplace operators selling through Shopify, Amazon, bol.com, or similar platforms.
- Agencies supporting multiple online stores.
- Fractional CFOs building repeatable financial review processes.
- Excel professionals who need an auditable analytical framework rather than another dashboard.

This toolkit is **not** intended to replace accounting software, ERP platforms, warehouse management systems, or enterprise financial consolidation solutions.

No spreadsheet expertise is required. Open the browser version or Excel workbook, import operational data, and begin analyzing profitability immediately.

---

# About

I build lightweight Excel-based decision-support tools for operational problems that become difficult once too many moving parts interact at the same time.

Instead of asking how to automate every task, I usually begin with a different question:

> **"What information needs to exist in one place so the next business decision can be made with confidence?"**

This toolkit is one example of that philosophy. Rather than replacing existing business systems, it brings together the financial information that already exists and organizes it into a repeatable analytical framework for pricing, purchasing, operational reviews, and profitability decisions.

---

# Technical Details

<details>
<summary><strong>For technical reviewers, Excel practitioners, and collaborators</strong></summary>

## Workbook Architecture

The workbook follows a layered architecture that separates raw operational data from financial rules, calculation logic, reconciliation, and executive reporting. This separation minimizes maintenance while ensuring historical calculations remain reproducible.

```text
Raw Data
│
├── RAW_Orders
├── RAW_Payouts
├── RAW_3PL_Invoices
├── RAW_Refunds
└── RAW_AdSpend
        │
        ▼
Business Rules
│
├── SYS_Parameters
├── SYS_Rate_History
└── MAP_Bundle_Rules
        │
        ▼
Calculation Engine
│
├── ENG_Profit_Engine
├── AUD_Shipping_Tier
└── REC_Reconciliation
        │
        ▼
Executive Reporting
│
└── DASH_Executive_Board
```

### Workbook Layers

| Layer | Sheets | Purpose |
|--------|--------|---------|
| Data Input | RAW_Orders, RAW_Payouts, RAW_3PL_Invoices, RAW_Refunds, RAW_AdSpend | Import operational data exactly as exported from business systems. |
| Parameters | SYS_Parameters, SYS_Rate_History | Maintain global assumptions, historical costs, exchange rates, fee schedules, and reconciliation thresholds. |
| Mapping | MAP_Bundle_Rules | Decompose bundle products and allocate procurement costs to physical inventory items. |
| Calculation Engine | ENG_Profit_Engine | Produce order-level profitability using historical financial snapshots. |
| Validation | AUD_Shipping_Tier | Determine shipping confidence level and identify estimated versus actual logistics costs. |
| Reconciliation | REC_Reconciliation | Compare calculated profitability with payout records and logistics invoices. |
| Dashboard | DASH_Executive_Board | Present executive KPIs and operational trends for decision making. |

### Data Flow

```
Operational Data
        │
        ▼
Historical Cost Matching
        │
        ▼
Currency Normalization
        │
        ▼
Bundle Cost Allocation
        │
        ▼
Shipping Allocation
        │
        ▼
Payment & Marketplace Fees
        │
        ▼
Refund Attribution
        │
        ▼
Order Profit
        │
        ▼
Financial Reconciliation
        │
        ▼
Management Dashboard
```

Every downstream calculation depends only on validated upstream inputs. Historical records are intentionally isolated from future parameter changes through point-in-time matching.

---

## Three Traps That Catch Even Experienced E-commerce Finance Teams

### Trap 1 — Averaging Shipping Costs Across Every Product

A pricing decision is made after reviewing average shipping cost per SKU.

The analysis assumes shipping increases proportionally with product quantity.

In practice, logistics providers charge per shipment, weight bracket, dimensional weight, destination, or package combination—not per individual SKU.

As a result, lightweight accessories may appear expensive to ship while bundled premium products appear artificially profitable.

| Incorrect Approach | Correct Approach |
|--------------------|------------------|
| Shipping divided equally across every line item. | Shipping allocated using actual logistics invoices whenever available. |
| One average shipping value. | Tiered allocation based on shipment, bundle composition, weight, and validated fallback rules. |
| Product margin rankings become unreliable. | Product profitability reflects actual fulfillment economics. |

**Decision Outcome**

Before:

```text
Product A Margin      34%
Bundle Margin         29%
```

After:

```text
Product A Margin      27%
Bundle Margin         18%
```

The pricing strategy changes because shipping is no longer hiding the true fulfillment cost.

<details>
<summary>Formula Logic</summary>

Uses hierarchical shipping allocation:

```
Actual 3PL Invoice
        ↓
Bundle Combination Rate
        ↓
Weight-Based Estimate
        ↓
Channel Average
```

Confidence labels are assigned according to the allocation source.

</details>

---
### Trap 2 — Using Today's Costs to Measure Yesterday's Orders

A purchasing review concludes that margins have deteriorated dramatically over the last six months.

The calculation appears reasonable because every historical order is evaluated using the latest supplier cost and exchange rate.

The hidden assumption is that procurement costs never change.

In reality, suppliers adjust pricing, exchange rates fluctuate daily, and marketplace commissions evolve over time. Recalculating historical orders with today's assumptions destroys the integrity of trend analysis.

| Incorrect Approach | Correct Approach |
|--------------------|------------------|
| Recalculate all historical orders using current COGS and FX rates. | Match every transaction with the cost and exchange rate effective on the original order date. |
| Historical reports change every time procurement prices change. | Historical reports remain reproducible and comparable across months and years. |
| Margin deterioration may be entirely artificial. | Margin trends reflect genuine operational performance. |

**Decision Outcome**

Before:

```text
Q1 Margin        21.4%
Q2 Margin        17.8%

Conclusion:
Supplier performance deteriorated.
```

After:

```text
Q1 Margin        21.5%
Q2 Margin        21.1%

Conclusion:
Supplier performance remained stable.
Marketing spend increased instead.
```

The management response changes from supplier renegotiation to advertising optimization because historical profitability is preserved.

<details>
<summary>Formula Logic</summary>

Historical values are retrieved using effective date ranges.

```
Order Date
      │
      ▼
Historical FX Table
      │
Historical COGS Table
      │
Marketplace Fee History
      │
Point-in-Time Profit
```

Every lookup matches both the business key and the effective date interval rather than simply returning the latest available value.

</details>

---

### Trap 3 — Assuming Marketplace Payout Equals Business Profit

Finance receives a marketplace payout that appears to match expected revenue.

The payout is treated as proof that profitability calculations are correct.

However, payouts aggregate deductions from multiple operational processes including payment fees, commissions, refunds, shipping adjustments, reserve holds, packaging charges, and timing differences.

Matching deposits to sales does not prove profitability.

| Incorrect Approach | Correct Approach |
|--------------------|------------------|
| Treat payout amount as the final profit indicator. | Reconstruct every cost component before reconciliation. |
| Investigate discrepancies manually after month-end. | Reconcile orders, payouts, logistics invoices, and calculated profit continuously. |
| Financial errors remain hidden until accounting closes. | Exceptions are identified at the individual order level. |

**Decision Outcome**

Before:

```text
Revenue            $50,000
Marketplace Payout $44,100

Difference accepted
as platform fees.
```

After:

```text
Revenue                    $50,000
Marketplace Fees            $3,800
Payment Fees                  $940
Shipping Adjustments           $510
Unexpected Difference          $650
```

The remaining difference becomes an actionable investigation instead of disappearing into an aggregated expense account.

<details>
<summary>Formula Logic</summary>

```
Orders
   │
   ├── Payment Records
   ├── Shipping Invoices
   ├── Refund Records
   └── Marketplace Fees
            │
            ▼
Financial Reconciliation
            │
            ▼
Matched / Discrepancy
```

Tolerance thresholds are maintained centrally so reconciliation rules remain consistent across the workbook.

</details>

---

## Example Scenario

A multi-channel retailer sells a bundle consisting of a coffee machine, two accessory kits, and a complimentary filter pack through Shopify in Germany.

The order value is **$249.00**. Shipping is fulfilled by a third-party logistics provider, procurement costs are maintained in USD, reporting is performed in EUR, and the customer requests a partial refund two weeks later.

Using a conventional spreadsheet, profitability appears straightforward. Revenue is reduced by an estimated commission, shipping is divided evenly across every product, and the latest procurement cost is applied because it is the only value available. The resulting report shows a healthy margin of approximately **24%**, encouraging the merchandising team to expand advertising for similar bundles.

The calculation changes substantially after reconstructing the transaction using this workbook.

The engine first retrieves the procurement cost that was valid on the original order date rather than today's supplier price. Historical exchange rates normalize every financial component into the reporting currency. Bundle mapping allocates procurement cost to the underlying physical products instead of the virtual bundle SKU. Actual logistics invoices override estimated freight, while the refund is attributed back to the originating order instead of reducing profitability in a later reporting period.

The final result shows a net margin closer to **15%** rather than **24%**.

Nothing about the order changed.

Only the financial assumptions became historically accurate.

For operational decision-making, that distinction matters. The merchandising team avoids scaling an advertising campaign that appeared profitable only because shipping allocation, historical procurement costs, and refund attribution were oversimplified.

---

### Formula Reference

<details>
<summary>Calculation Engine (ENG_Profit_Engine)</summary>

| Function | Purpose |
|----------|---------|
| `LET()` | Creates readable intermediate variables for complex financial calculations. |
| `MAP()` | Applies order-level calculations dynamically across every transaction. |
| `LAMBDA()` | Encapsulates reusable calculation logic without VBA. |
| `XLOOKUP()` | Retrieves historical rates, supplier costs, exchange rates, and configuration values. |
| `FILTER()` | Extracts order-specific transaction records dynamically. |
| `SUMIFS()` | Aggregates revenue, refunds, and logistics costs by order. |

The calculation engine combines these functions to produce a fully dynamic order-level profit model without requiring copied formulas.

</details>

<details>
<summary>Historical Rate Management</summary>

The workbook implements point-in-time accounting by matching every transaction against:

- Historical procurement costs
- Historical exchange rates
- Marketplace fee schedules
- Shipping rate versions
- Effective date ranges

This prevents future parameter changes from modifying historical profitability.

</details>

<details>
<summary>Shipping Allocation Engine</summary>

Shipping allocation follows a deterministic hierarchy:

```
Tier 1
Actual 3PL Invoice

↓

Tier 2
Bundle Combination Rate

↓

Tier 3
Weight-Based Estimate

↓

Tier 4
Channel Average
```

Every calculated shipping value receives a confidence classification so decision-makers understand whether profit is based on actual operational data or structured estimation.

</details>

<details>
<summary>Financial Reconciliation</summary>

The reconciliation engine compares:

- Orders
- Marketplace payouts
- Logistics invoices
- Refund transactions
- Payment fees

Outputs include reconciliation status, monetary differences, and configurable exception thresholds.

</details>

---

### Validation Rules

| Field | Validation Rule | Error Behavior |
|------|-----------------|----------------|
| Order ID | Must be unique and non-empty. | Duplicate orders are flagged for review. |
| Order Date | Must exist within historical rate coverage. | Missing historical rates trigger lookup exceptions. |
| Currency | Must exist in the exchange-rate table. | Currency normalization is prevented until resolved. |
| SKU | Must exist in the product or bundle mapping tables. | Procurement cost cannot be assigned. |
| Historical Cost | Effective date ranges cannot overlap for the same SKU. | Conflicting historical values are highlighted. |
| Shipping Invoice | Multiple invoices must reconcile to the same shipment. | Shipping confidence is downgraded. |
| Refund Reference | Original order must exist. | Refund cannot be attributed automatically. |
| Marketplace Fee | Historical fee schedule required. | Default fallback rate is used when permitted. |
| Reconciliation Difference | Must remain within configured tolerance. | Status changes to **DISCREPANCY**. |
| Dashboard KPIs | Depend only on validated calculation outputs. | Invalid upstream data propagates visible warning indicators. |

</details>

---

## Other Tools in This Series

- **Manufacturing Labor Cost & Capacity Planning Toolkit** — Analyze workforce utilization, production capacity, and labor cost efficiency.
- **Demand-Adaptive Inventory Planning Toolkit** — Plan replenishment using lead time, demand variability, and purchasing scenarios.
- **Rental Property Operations Toolkit** — Monitor occupancy, vacancies, maintenance, and rental performance from a single workbook.
- **Project Portfolio Planning Toolkit** — Track budgets, schedules, priorities, and delivery progress across multiple initiatives.

More operational decision-support tools are available through the Gumroad store and GitHub profile.

---

## License

Licensed under the **Apache License 2.0**.

This repository may be used, modified, and distributed in accordance with the terms of the Apache License 2.0. See the `LICENSE` file for the complete license text.
