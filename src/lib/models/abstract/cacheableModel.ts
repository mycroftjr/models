/**
 * Base for models that either can be cached or are part of another model that
 * can be cached. They may have an owning model that needs to be notified when
 * they are changed.
 */
export default abstract class CacheableModel {
  // HACK: This is the easiest way to implement this, but it is inefficient both
  // in terms of space and time. Ideally, there should be one static set per 
  // class that is used, but for now, this will stay in for simplicity.
  private _cachedProps: string[] = [];

  constructor(public owner?: CacheableModel) {
    this._cachedProps = ['owner'];

    return new Proxy(this, {
      set(obj: CacheableModel, prop: string, value: any) {
        const ref = Reflect.set(obj, prop, value);
        if (obj._cachedProps.includes(prop)) obj.uncache();
        return ref;
      }
    });
  }

  /**
   * Uncaches this model and notifies its owner (if it has one) to do the same.
   */
  uncache() {
    this.owner?.uncache();
  }

  /**
   * Watches the properties with the given names for changes. When they change,
   * this model is uncached.
   * 
   * @param propNames Names of props that should be watched for changes
   */
  protected _watchProps(...propNames: string[]) {
    this._cachedProps.push(...propNames);
  }
}
