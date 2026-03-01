export interface Process {
  id: string
  name: string
  description: string
  zoneId: number
}

export interface Zone {
  id: number
  name: string
  shortName: string
  image: string
  subtitle: string
  processes: Process[]
}

export const ZONES: Zone[] = [
  {
    id: 1,
    name: "Suppliers & Procurement",
    shortName: "Suppliers",
    image: "/zones/zone-1.jpg",
    subtitle: "Select the processes that represent your biggest challenges in this area",
    processes: [
      { id: "sp-1", name: "Purchase Order Management", description: "End-to-end PO lifecycle from creation to fulfillment tracking", zoneId: 1 },
      { id: "sp-2", name: "Supplier Collaboration", description: "Real-time communication and data sharing with suppliers", zoneId: 1 },
      { id: "sp-3", name: "Forecast & Commit Management", description: "Aligning supplier commitments with demand forecasts", zoneId: 1 },
      { id: "sp-4", name: "Supplier Inventory Visibility", description: "Monitoring supplier stock levels and availability in real time", zoneId: 1 },
      { id: "sp-5", name: "Supplier Onboarding & Qualification", description: "Vetting, qualifying, and onboarding new suppliers efficiently", zoneId: 1 },
      { id: "sp-6", name: "Contract Management", description: "Managing supplier contracts, terms, and renewal workflows", zoneId: 1 },
      { id: "sp-7", name: "Supplier Performance Management", description: "Tracking KPIs, scorecards, and supplier reliability metrics", zoneId: 1 },
      { id: "sp-8", name: "Spend Analytics", description: "Analyzing procurement spend patterns and cost optimization", zoneId: 1 },
    ],
  },
  {
    id: 2,
    name: "Planning & S&OP",
    shortName: "Planning",
    image: "/zones/zone-2.jpg",
    subtitle: "Select the processes that represent your biggest challenges in this area",
    processes: [
      { id: "pl-1", name: "S&OP Process", description: "Cross-functional sales and operations planning alignment", zoneId: 2 },
      { id: "pl-2", name: "Integrated Business Planning", description: "Connecting financial, operational, and strategic plans", zoneId: 2 },
      { id: "pl-3", name: "Consensus Forecasting", description: "Building unified demand forecasts across stakeholders", zoneId: 2 },
      { id: "pl-4", name: "Scenario Planning", description: "Modeling what-if scenarios for supply chain disruptions", zoneId: 2 },
      { id: "pl-5", name: "Demand Planning", description: "Forecasting customer demand using historical and market data", zoneId: 2 },
      { id: "pl-6", name: "Supply Planning", description: "Balancing supply capacity with projected demand requirements", zoneId: 2 },
      { id: "pl-7", name: "Demand Sensing", description: "Using real-time signals to adjust short-term demand forecasts", zoneId: 2 },
      { id: "pl-8", name: "Multi-Echelon Inventory Optimization", description: "Optimizing inventory across multiple supply chain tiers", zoneId: 2 },
    ],
  },
  {
    id: 3,
    name: "Manufacturing & Production",
    shortName: "Manufacturing",
    image: "/zones/zone-3.jpg",
    subtitle: "Select the processes that represent your biggest challenges in this area",
    processes: [
      { id: "mf-1", name: "Production Scheduling", description: "Planning and sequencing production runs for efficiency", zoneId: 3 },
      { id: "mf-2", name: "Shop Floor Execution", description: "Managing real-time operations on the manufacturing floor", zoneId: 3 },
      { id: "mf-3", name: "Quality Management", description: "Ensuring product quality through inspections and compliance", zoneId: 3 },
      { id: "mf-4", name: "Work Order Management", description: "Creating, tracking, and closing manufacturing work orders", zoneId: 3 },
      { id: "mf-5", name: "Capacity Planning", description: "Aligning production capacity with demand and constraints", zoneId: 3 },
      { id: "mf-6", name: "Manufacturing BOM Management", description: "Maintaining accurate bills of materials for production", zoneId: 3 },
      { id: "mf-7", name: "Yield & Scrap Management", description: "Tracking production yields and minimizing material waste", zoneId: 3 },
    ],
  },
  {
    id: 4,
    name: "Global Trade & Compliance",
    shortName: "Trade",
    image: "/zones/zone-4.jpg",
    subtitle: "Select the processes that represent your biggest challenges in this area",
    processes: [
      { id: "gt-1", name: "HS Code Classification", description: "Accurately classifying goods for international trade tariffs", zoneId: 4 },
      { id: "gt-2", name: "BOM Qualification for FTAs", description: "Qualifying product BOMs for free trade agreement benefits", zoneId: 4 },
      { id: "gt-3", name: "Export License Management", description: "Managing export licenses and government authorizations", zoneId: 4 },
      { id: "gt-4", name: "Restricted Party Screening", description: "Screening partners against restricted and denied party lists", zoneId: 4 },
      { id: "gt-5", name: "Trade Compliance Reporting", description: "Generating compliance reports for regulatory authorities", zoneId: 4 },
      { id: "gt-6", name: "Sanctions Screening", description: "Ensuring transactions comply with international sanctions", zoneId: 4 },
      { id: "gt-7", name: "Import/Export Documentation", description: "Managing customs documents, invoices, and certificates", zoneId: 4 },
      { id: "gt-8", name: "Duty & Tariff Management", description: "Calculating and optimizing duties and tariffs on goods", zoneId: 4 },
    ],
  },
  {
    id: 5,
    name: "Logistics & Transportation",
    shortName: "Logistics",
    image: "/zones/zone-5.jpg",
    subtitle: "Select the processes that represent your biggest challenges in this area",
    processes: [
      { id: "lt-1", name: "Load & Route Planning", description: "Optimizing shipment loads and delivery route efficiency", zoneId: 5 },
      { id: "lt-2", name: "Carrier Tendering", description: "Soliciting and evaluating carrier bids for shipments", zoneId: 5 },
      { id: "lt-3", name: "Shipment Execution & Visibility", description: "Tracking shipments in transit with real-time visibility", zoneId: 5 },
      { id: "lt-4", name: "Freight Audit & Settlement", description: "Auditing freight invoices and resolving billing discrepancies", zoneId: 5 },
      { id: "lt-5", name: "Last-Mile Delivery Management", description: "Managing the final delivery leg to end customers", zoneId: 5 },
      { id: "lt-6", name: "Carrier Performance Management", description: "Evaluating carrier reliability, cost, and service quality", zoneId: 5 },
      { id: "lt-7", name: "Warehouse Management", description: "Coordinating warehouse operations, storage, and fulfillment", zoneId: 5 },
      { id: "lt-8", name: "Reverse Logistics", description: "Managing returns, refurbishment, and recycling workflows", zoneId: 5 },
    ],
  },
  {
    id: 6,
    name: "Channel & Sales",
    shortName: "Channel",
    image: "/zones/zone-6.jpg",
    subtitle: "Select the processes that represent your biggest challenges in this area",
    processes: [
      { id: "cs-1", name: "Channel Management", description: "Overseeing partner channels and distribution strategies", zoneId: 6 },
      { id: "cs-2", name: "MDF / Co-op Fund Management", description: "Allocating and tracking market development funds", zoneId: 6 },
      { id: "cs-3", name: "Incentive & Rebate Programs", description: "Designing and managing partner incentive programs", zoneId: 6 },
      { id: "cs-4", name: "Partner Pricing & Deal Registration", description: "Setting partner pricing tiers and registering deals", zoneId: 6 },
      { id: "cs-5", name: "Channel Forecasting", description: "Forecasting sales through indirect partner channels", zoneId: 6 },
      { id: "cs-6", name: "Sell-Through Reporting", description: "Tracking product sell-through rates at the channel level", zoneId: 6 },
      { id: "cs-7", name: "Partner Portal Management", description: "Maintaining partner-facing portals and self-service tools", zoneId: 6 },
      { id: "cs-8", name: "Channel Inventory Visibility", description: "Monitoring inventory levels across distribution channels", zoneId: 6 },
    ],
  },
]

export const INDUSTRIES = [
  "Manufacturing",
  "Retail & Consumer Goods",
  "Technology",
  "Logistics & 3PL",
  "Pharma & Life Sciences",
  "Automotive",
  "Aerospace & Defense",
  "Energy & Utilities",
  "Financial Services",
  "Other",
]

export const COMPANY_SIZES = [
  "1\u2013500 employees",
  "501\u20135,000",
  "5,001\u201325,000",
  "25,000+",
]
