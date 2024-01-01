import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const stateEnum = pgEnum("state", ["open", "used", "active"]);

// User Table
export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  name: text("name"),
  maxCardAmount: integer("max_card_amount"),
  teamId: integer("team_id")
    .notNull()
    .references(() => team.id),
});

// Round Table
export const round = pgTable("round", {
  id: serial("id").primaryKey(),
  name: text("name"),
  position: integer("position"),
});

// Team Table
export const team = pgTable("team", {
  id: serial("id").primaryKey(),
  points: integer("points"),
  gameId: integer("game_id"),
});

// Game Table
export const game = pgTable("game", {
  id: serial("id").primaryKey(),
  currentRound: integer("current_round"),
  winnerId: integer("winner").references(() => team.id),
  currentUserId: integer("current_user_id").references(() => user.id),
});

// Card Table
export const card = pgTable("card", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  name: text("name"),
  state: stateEnum("open"),
  gameId: integer("game_id")
    .notNull()
    .references(() => game.id),
});

export const cardsRelations = relations(card, ({ one, many }) => ({
  game: one(game, {
    fields: [card.gameId],
    references: [game.id],
  }),
}));

export const gameRelations = relations(game, ({ one, many }) => ({
  teams: many(team),
  cards: many(card),
  winnerId: one(team, {
    fields: [game.winnerId],
    references: [team.id],
  }),
  currentUser: one(user, {
    fields: [game.currentUserId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ one }) => ({
  team: one(team, {
    fields: [user.teamId],
    references: [team.id],
  }),
}));

export const teamRelations = relations(team, ({ one, many }) => ({
  users: many(user),
  game: one(game, {
    fields: [team.gameId],
    references: [game.id],
  }),
}));
