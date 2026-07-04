/**
 * Characterization tests for the /api/episodes route (response shape, caching, errors).
 * The router holds module-level state (NodeCache, rate limiter), so each test builds
 * a fresh app via jest.isolateModules.
 */

const express = require("express");
const request = require("supertest");

const mockClient = { release: jest.fn() };
const mockDb = {
  getMissingEpisodes: jest.fn(),
  getShortenedEpisodes: jest.fn(),
  getLastChecked: jest.fn(),
};

jest.mock("../db/connect", () => ({ connect: jest.fn(async () => mockClient) }));
jest.mock("../db/db", () => jest.fn(() => mockDb));

const errorHandler = require("./middlewares/error-handler");

// mirrors how app.js mounts the router
function buildApp() {
  let router;
  jest.isolateModules(() => {
    ({ api: router } = require("./api"));
  });
  const app = express();
  app.use(router);
  app.use(errorHandler);
  return app;
}

const missingEpisodes = [{ full_name: "#100 - Guest", episode_number: 100 }];
const shortenedEpisodes = [{ id: 5, full_name: "#200 - Other" }];
const lastChecked = 1700000000000;

beforeAll(() => {
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

beforeEach(() => {
  for (const fn of Object.values(mockDb)) fn.mockReset();
  mockClient.release.mockClear();

  mockDb.getMissingEpisodes.mockResolvedValue(missingEpisodes);
  mockDb.getShortenedEpisodes.mockResolvedValue(shortenedEpisodes);
  mockDb.getLastChecked.mockResolvedValue(lastChecked);
});

test("GET /api/episodes returns the missing/shortened/lastChecked payload", async () => {
  const res = await request(buildApp()).get("/api/episodes");

  expect(res.status).toBe(200);
  expect(res.body).toEqual({
    missingEpisodes,
    shortenedEpisodes,
    lastCheckedInMs: lastChecked,
  });
  expect(mockClient.release).toHaveBeenCalledTimes(1);
});

test("second request within the cache TTL does not hit the database", async () => {
  const app = buildApp();

  const first = await request(app).get("/api/episodes");
  const second = await request(app).get("/api/episodes");

  expect(mockDb.getMissingEpisodes).toHaveBeenCalledTimes(1);
  expect(mockDb.getShortenedEpisodes).toHaveBeenCalledTimes(1);
  expect(mockDb.getLastChecked).toHaveBeenCalledTimes(1);
  expect(second.body).toEqual(first.body);
});

test("db error responds 500 via the error handler", async () => {
  const app = buildApp();
  mockDb.getMissingEpisodes.mockRejectedValue(new Error("db down"));

  const res = await request(app).get("/api/episodes");

  expect(res.status).toBe(500);
  expect(res.text).toMatch(/Something went wrong on the server/);
  expect(mockClient.release).toHaveBeenCalledTimes(1);
});
