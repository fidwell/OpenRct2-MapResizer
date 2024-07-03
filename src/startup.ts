import { absolute, graphics, spinner, store, twoway, window } from "openrct2-flexui";
import service from "./service";

const _service = new service();

const size_nw_se = (): number =>
	(ui.mainViewport.rotation % 2 == 0 ? map.size.y : map.size.x) - 2;

const size_ne_sw = (): number =>
	(ui.mainViewport.rotation % 2 == 0 ? map.size.x : map.size.y) - 2;

let sizeNESW = store<number>(size_ne_sw());
let sizeNWSE = store<number>(size_nw_se());

let timeoutHandle: number = -1;
let mapRotation: number = ui.mainViewport.rotation;

const setSpinnerValues = function (): void {
	sizeNESW.set(size_ne_sw());
	sizeNWSE.set(size_nw_se());
}

const shifterWindow = window({
	title: "Shift map",
	width: { value: 300 },
	height: { value: 172 },
	content: [
		absolute([
			graphics({
				onDraw: (g: GraphicsContext) => {
					// Draw the big diamond
					g.line(144, 6, 6, 75);
					g.line(6, 75, 144, 144);
					g.line(144, 144, 282, 75);
					g.line(282, 75, 144, 6);
				},
				x: 0,
				y: 0,
				width: "100%",
				height: "100%"
			}),
			spinner({
				minimum: 3,
				maximum: 999,
				value: twoway(sizeNWSE),
				onChange: (value: number, adjustment: number) => _service.adjust(0, value, adjustment),
				x: 6,
				y: 6,
				width: 60,
				height: 15
			}),
			spinner({
				minimum: 3,
				maximum: 999,
				value: twoway(sizeNESW),
				onChange: (value: number, adjustment: number) => _service.adjust(1, value, adjustment),
				x: 228,
				y: 6,
				width: 60,
				height: 15
			}),
			spinner({
				minimum: 3,
				maximum: 999,
				value: twoway(sizeNWSE),
				onChange: (value: number, adjustment: number) => _service.adjust(2, value, adjustment),
				x: 228,
				y: 130,
				width: 60,
				height: 15
			}),
			spinner({
				minimum: 3,
				maximum: 999,
				value: twoway(sizeNESW),
				onChange: (value: number, adjustment: number) => _service.adjust(3, value, adjustment),
				x: 6,
				y: 130,
				width: 60,
				height: 15
			})
		])
	],
	onClose: () => context.clearInterval(timeoutHandle)
});

export function startup() {
	if (typeof ui !== "undefined")
	{
		ui.registerMenuItem("Shift map", () => {
			setSpinnerValues();
			shifterWindow.open();

			// I don't think we can subscribe to the
			// viewport being rotated, so this is
			// the best I can do for now
			timeoutHandle = context.setInterval(() => { 
				if (mapRotation != ui.mainViewport.rotation) {
					mapRotation = ui.mainViewport.rotation;
					setSpinnerValues();
				}
			 }, 100);
		});
	}
}
