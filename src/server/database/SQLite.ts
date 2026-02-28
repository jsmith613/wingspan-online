import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { GameId } from '../../common/Types';
import { SerializedGame } from '../SerializedGame';
import { IDatabase } from './IDatabase';

export class SQLiteDatabase implements IDatabase {
  private db: SqlJsDatabase | null = null;
  private readonly dbPath: string;

  constructor(dbPath: string = path.resolve(process.cwd(), 'data', 'wingspan.sqlite')) {
    this.dbPath = dbPath;
  }

  async initializeAsync(): Promise<void> {
    const SQL = await initSqlJs();
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(this.dbPath)) {
      const file = fs.readFileSync(this.dbPath);
      this.db = new SQL.Database(new Uint8Array(file));
    } else {
      this.db = new SQL.Database();
    }
    this.initialize();
  }

  initialize(): void {
    if (!this.db) throw new Error('Database not initialized. Call initializeAsync() first.');
    this.db.run(`
      CREATE TABLE IF NOT EXISTS games (
        id TEXT PRIMARY KEY,
        state TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `);
    this.persist();
  }

  saveGame(game: SerializedGame): void {
    if (!this.db) throw new Error('Database not initialized');
    const stmt = this.db.prepare(
      'INSERT OR REPLACE INTO games (id, state, updated_at) VALUES (:id, :state, :updated_at)'
    );
    stmt.run({
      ':id': game.id,
      ':state': JSON.stringify(game),
      ':updated_at': Date.now(),
    });
    stmt.free();
    this.persist();
  }

  loadGame(id: GameId): SerializedGame | undefined {
    if (!this.db) throw new Error('Database not initialized');
    const stmt = this.db.prepare('SELECT state FROM games WHERE id = :id');
    stmt.bind({ ':id': id });
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return JSON.parse(row.state as string) as SerializedGame;
    }
    stmt.free();
    return undefined;
  }

  deleteGame(id: GameId): void {
    if (!this.db) throw new Error('Database not initialized');
    const stmt = this.db.prepare('DELETE FROM games WHERE id = :id');
    stmt.run({ ':id': id });
    stmt.free();
    this.persist();
  }

  private persist(): void {
    if (!this.db) return;
    const bytes = this.db.export();
    fs.writeFileSync(this.dbPath, Buffer.from(bytes));
  }
}
