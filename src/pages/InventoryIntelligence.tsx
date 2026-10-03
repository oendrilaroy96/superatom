import Inventory2Icon from "@mui/icons-material/Inventory2";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SolutionPage, { type SolutionFeature } from "../components/SolutionPage";

const features: SolutionFeature[] = [
  {
    title: "Demand-Aware Replenishment",
    desc: "Recommends what to reorder and when, based on forecasted demand rather than static reorder points.",
    Icon: AutorenewIcon,
  },
  {
    title: "Multi-Echelon Visibility",
    desc: "See stock positions across every warehouse, DC and store from a single, unified view.",
    Icon: AccountTreeIcon,
  },
  {
    title: "Excess & Obsolescence Alerts",
    desc: "Surfaces slow-moving and at-risk inventory early, before it ties up working capital.",
    Icon: WarningAmberIcon,
  },
  {
    title: "Rebalancing Recommendations",
    desc: "Suggests where to move stock between locations to resolve shortages without new purchase orders.",
    Icon: SwapHorizIcon,
  },
];

export default function InventoryIntelligence() {
  return (
    <SolutionPage
      Icon={Inventory2Icon}
      eyebrow="Solutions"
      heading="Inventory Intelligence"
      description="Optimize, rebalance and prevent — keep the right stock in the right place, without the manual spreadsheet work."
      features={features}
    />
  );
}
