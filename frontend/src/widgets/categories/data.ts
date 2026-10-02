import {
  CircuitBoardIcon,
  ComputerIcon,
  CpuIcon,
  FanIcon,
  GpuIcon,
  HardDriveIcon,
  MemoryStickIcon,
  PackageIcon,
  PlugZapIcon,
} from "@/shared/ui/icons";

export const CATEGORY_ICONS: Record<string, typeof PackageIcon> = {
  processors: CpuIcon,
  "video-cards": GpuIcon,
  motherboards: CircuitBoardIcon,
  memory: MemoryStickIcon,
  storage: HardDriveIcon,
  "power-supplies": PlugZapIcon,
  cases: ComputerIcon,
  cooling: FanIcon,
};

export const DEFAULT_CATEGORY_ICON = PackageIcon;
