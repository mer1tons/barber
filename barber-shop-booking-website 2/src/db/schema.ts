import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const services = pgTable(
  "services",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    category: text("category").notNull().default("Prerje"),
    price: integer("price").notNull(),
    duration: integer("duration").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    active: boolean("active").notNull().default(true),
  },
  (t) => [index("services_active_idx").on(t.active)],
);

export const barbers = pgTable(
  "barbers",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    role: text("role").notNull().default("Berber"),
    bio: text("bio").notNull().default(""),
    avatarUrl: text("avatar_url").notNull().default(""),
    specialties: text("specialties").notNull().default(""),
    active: boolean("active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("barbers_active_idx").on(t.active)],
);

export const bookingStatus = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
]);

export const bookings = pgTable(
  "bookings",
  {
    id: serial("id").primaryKey(),
    code: text("code").notNull().unique(),
    serviceId: integer("service_id")
      .notNull()
      .references(() => services.id),
    barberId: integer("barber_id")
      .notNull()
      .references(() => barbers.id),
    date: text("date").notNull(),
    startMinutes: integer("start_minutes").notNull(),
    endMinutes: integer("end_minutes").notNull(),
    customerName: text("customer_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    notes: text("notes"),
    status: bookingStatus("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("bookings_date_idx").on(t.date),
    index("bookings_barber_date_idx").on(t.barberId, t.date),
    uniqueIndex("bookings_barber_slot_ux").on(t.barberId, t.date, t.startMinutes),
  ],
);

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    author: text("author").notNull(),
    rating: integer("rating").notNull().default(5),
    body: text("body").notNull(),
    service: text("service").notNull().default(""),
    approved: boolean("approved").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("reviews_approved_idx").on(t.approved)],
);

export type Service = typeof services.$inferSelect;
export type Barber = typeof barbers.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Review = typeof reviews.$inferSelect;
