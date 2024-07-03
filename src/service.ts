export default class service {
  private changeSizeXmin(value: number): void {
    const target: number = value + 2;
    context.executeAction("mapchangesize", <MapChangeSizeArgs>{
      targetSizeX: target,
      targetSizeY: map.size.y,
      shiftX: 0,
      shiftY: 0
    });
  }

  private changeSizeXmax(value: number, adjustment: number): void {
    const target: number = value + 2;
    context.executeAction("mapchangesize", <MapChangeSizeArgs>{
      targetSizeX: target,
      targetSizeY: map.size.y,
      shiftX: adjustment > 0 ? 1 : -1,
      shiftY: 0
    });
  }

  private changeSizeYmin(value: number): void {
    const target: number = value + 2;
    context.executeAction("mapchangesize", <MapChangeSizeArgs>{
      targetSizeX: map.size.x,
      targetSizeY: target,
      shiftX: 0,
      shiftY: 0
    });
  }

  private changeSizeYmax(value: number, adjustment: number): void {
    const target: number = value + 2;
    context.executeAction("mapchangesize", <MapChangeSizeArgs>{
      targetSizeX: map.size.x,
      targetSizeY: target,
      shiftX: 0,
      shiftY: adjustment > 0 ? 1 : -1
    });
  }

  public adjust(side: number, value: number, adjustment: number): void {
    switch ((ui.mainViewport.rotation + side + (ui.mainViewport.rotation % 2 == 0 ? 0 : 2)) % 4) {
      case 0: this.changeSizeYmax(value, adjustment); break;
      case 1: this.changeSizeXmax(value, adjustment); break;
      case 2: this.changeSizeYmin(value); break;
      case 3: this.changeSizeXmin(value); break;
    }
  }
}
