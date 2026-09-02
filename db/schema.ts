import { sqliteTable, text, index } from "drizzle-orm/sqlite-core";
export const generatedWorkouts=sqliteTable("generated_workouts",{
  id:text("id").primaryKey(),userId:text("user_id").notNull(),email:text("email").notNull(),visibility:text("visibility").notNull(),title:text("title").notNull(),dataJson:text("data_json").notNull(),createdAt:text("created_at").notNull(),updatedAt:text("updated_at").notNull()
},table=>[index("idx_generated_workouts_user_created").on(table.userId,table.createdAt),index("idx_generated_workouts_visibility_created").on(table.visibility,table.createdAt)]);
export const appState=sqliteTable("app_state",{
  key:text("key").primaryKey(),dataJson:text("data_json").notNull(),revision:text("revision").notNull(),updatedAt:text("updated_at").notNull(),updatedBy:text("updated_by").notNull()
});
