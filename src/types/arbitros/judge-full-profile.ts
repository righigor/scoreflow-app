import type { ArbitroType } from "./arbitro-type";
import type { JudgeProfileType } from "./judge-profile";

export interface JudgeFullProfileType {
  judge: ArbitroType;
  profile: JudgeProfileType;
}