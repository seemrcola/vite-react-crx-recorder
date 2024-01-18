import Dexie, {Table} from "dexie";

interface Record {
  name: string;
  url: string;
}

class RecordDatabase extends Dexie {
  public record!: Table<Record, number>;
  
  public constructor() {
    super("RecordDatabase");
    this.version(1).stores({
      record: "++id, name, url"
    });
  }
}

// 创建一个数据库，用于存储视频录制数据
const db = new RecordDatabase();

export default db;
