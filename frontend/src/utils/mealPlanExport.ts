import {
    Document,
    Packer,
    Paragraph,
    Table,
    TableRow,
    TableCell,
    TextRun,
    HeadingLevel,
    WidthType,
    AlignmentType,
    BorderStyle,
} from "docx";
import type { MealSlot, PlannedMeal } from "../api/mealPlans";

const DAYS_CS_FULL = [
    "Neděle",
    "Pondělí",
    "Úterý",
    "Středa",
    "Čtvrtek",
    "Pátek",
    "Sobota",
];
const SLOT_LABELS: Record<MealSlot, string> = { obed: "Oběd", vecere: "Večeře" };
const SLOTS: MealSlot[] = ["obed", "vecere"];

function formatDayLong(dateStr: string) {
    const [y, m, day] = dateStr.split("-").map(Number);
    const d = new Date(y, m - 1, day);
    return `${DAYS_CS_FULL[d.getDay()]} ${d.getDate()}. ${d.getMonth() + 1}.`;
}

function formatRange(weekDays: string[]) {
    if (weekDays.length === 0) return "";
    const first = weekDays[0];
    const last = weekDays[weekDays.length - 1];
    const [, fm, fd] = first.split("-").map(Number);
    const [ly, lm, ld] = last.split("-").map(Number);
    return `${fd}. ${fm}. – ${ld}. ${lm}. ${ly}`;
}

const BORDER = {
    top: { style: BorderStyle.SINGLE, size: 4, color: "C7B79C" },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: "C7B79C" },
    left: { style: BorderStyle.SINGLE, size: 4, color: "C7B79C" },
    right: { style: BorderStyle.SINGLE, size: 4, color: "C7B79C" },
};

function headerCell(text: string) {
    return new TableCell({
        borders: BORDER,
        shading: { fill: "F5EDDF" },
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text,
                        bold: true,
                        color: "401F0A",
                    }),
                ],
            }),
        ],
    });
}

function bodyCell(text: string, opts: { bold?: boolean; muted?: boolean } = {}) {
    return new TableCell({
        borders: BORDER,
        children: [
            new Paragraph({
                children: [
                    new TextRun({
                        text,
                        bold: opts.bold,
                        color: opts.muted ? "9A8B7A" : "2A1A0A",
                        italics: opts.muted,
                    }),
                ],
            }),
        ],
    });
}

export async function exportMealPlanToDocx(
    weekDays: string[],
    getMeal: (date: string, slot: MealSlot) => PlannedMeal | null
) {
    const headerRow = new TableRow({
        tableHeader: true,
        children: [
            headerCell("Den"),
            headerCell(SLOT_LABELS.obed),
            headerCell(SLOT_LABELS.vecere),
        ],
    });

    const rows = weekDays.map((date) => {
        const cells = [bodyCell(formatDayLong(date), { bold: true })];
        for (const slot of SLOTS) {
            const meal = getMeal(date, slot);
            cells.push(
                meal
                    ? bodyCell(meal.recipeName)
                    : bodyCell("—", { muted: true })
            );
        }
        return new TableRow({ children: cells });
    });

    const doc = new Document({
        creator: "Cookbook",
        title: "Jídelníček",
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        heading: HeadingLevel.HEADING_1,
                        children: [
                            new TextRun({
                                text: "Jídelníček",
                                color: "401F0A",
                            }),
                        ],
                    }),
                    new Paragraph({
                        spacing: { after: 240 },
                        children: [
                            new TextRun({
                                text: formatRange(weekDays),
                                color: "8D6E63",
                                italics: true,
                            }),
                        ],
                    }),
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [headerRow, ...rows],
                    }),
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jidelnicek.docx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}