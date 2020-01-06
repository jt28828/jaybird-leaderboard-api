import Fuse = require("fuse.js");
import { FuseOptions } from "fuse.js";

export class SearchUtils {
  private static searchOptions: FuseOptions<any>;
  /** Fuzzy searches the provided list */
  public static search<T>(list: ReadonlyArray<T>, searchString: string, searchKeys?: string[]): T | null {
    const searchOptions = this.generateOptions(searchKeys);
    const fuse = new Fuse(list, searchOptions);

    const result = fuse.search(searchString);

    // Return the most matching option
    if (result?.length > 0) {
      return result[0] as T;
    } else {
      return null;
    }
  }

  /** Generates options for the current search list and returns them */
  private static generateOptions<T>(keys?: string[]): FuseOptions<T> {
    const options: FuseOptions<T> = {
      shouldSort: true,
      threshold: 0.1,
      location: 0,
      distance: 70,
      maxPatternLength: 32,
      minMatchCharLength: 1,
    };

    if (keys != null) {
      // Add keys if search item is an object
      options.keys = keys;
    }
    return options;
  }
}
