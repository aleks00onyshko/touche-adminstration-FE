import { createSelector } from "@ngrx/store";
import { selectTeachers } from "../../time-slots/store/time-slots.selectors";
import { DashboardState, selectDashboardState } from "../../../store/dashboard.reducer";

export const selectTeacherSettingsState = createSelector(
    selectDashboardState,
    (state: DashboardState) => state.teachers
  );
  

export const selectLoading = createSelector(selectTeacherSettingsState, state => state.loading);

export { selectTeachers };

