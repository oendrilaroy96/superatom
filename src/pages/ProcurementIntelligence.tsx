import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import GppGoodIcon from "@mui/icons-material/GppGood";
import BarChartIcon from "@mui/icons-material/BarChart";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import SolutionPage, { type SolutionFeature } from "../components/SolutionPage";

const features: SolutionFeature[] = [
  {
    title: "Supplier Risk Monitoring",
    desc: "Tracks supplier performance and risk signals so disruptions get flagged before they hit production.",
    Icon: GppGoodIcon,
  },
  {
    title: "Spend Analysis",
    desc: "Breaks down spend by category, supplier and business unit to surface savings opportunities.",
    Icon: BarChartIcon,
  },
  {
    title: "Contract & Compliance Tracking",
    desc: "Keeps contract terms, renewals and compliance requirements visible across every supplier relationship.",
    Icon: FactCheckIcon,
  },
  {
    title: "Sourcing Recommendations",
    desc: "Recommends alternate suppliers and sourcing strategies when lead times or costs shift.",
    Icon: TravelExploreIcon,
  },
];

export default function ProcurementIntelligence() {
  return (
    <SolutionPage
      Icon={ShoppingCartIcon}
      eyebrow="Solutions"
      heading="Procurement Intelligence"
      description="Source, plan and mitigate — give your procurement team the visibility to act before risk becomes disruption."
      features={features}
    />
  );
}
