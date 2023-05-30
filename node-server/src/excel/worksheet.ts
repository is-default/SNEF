import {randomInt} from "crypto";
import {supabase} from "../supabaseClient";

const xl = require('excel4node');


const getWorksheet = async (name:string) => {
    //Dataset assignment :
    const Attendance: any[][] = [
        ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
        [
            [
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
            ],
            [
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
            ],
            [
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
            ],
            [
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
            ],
            [
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
            ],
            [
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
            ],
            [
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
                randomInt(1, 9),
            ],
        ],
    ];

    //Excel initialization :
    const wb = new xl.Workbook({
        defaultFont: {
            size: 12,
            color: "#000000",
            name: "Calibri",
        },
    });
    wb.creator = "Foton Inc.";
    const options: any = {
        sheetFormat: {
            defaultColWidth: 20,
            defaultRowHeight: 20,
        },
    };

    //Excel styling :
    const centerBoldLarge = wb.createStyle({
        alignment: { horizontal: "center", vertical: "center" },
        font: { bold: true, color: "#000000", name: "Calibri", size: 36 },
    });

    const centerBoldMedium = wb.createStyle({
        alignment: { horizontal: "left", vertical: "center" },
        font: { bold: true, color: "#000000", name: "Calibri", size: 18 },
    });

    const centerBold = wb.createStyle({
        alignment: { horizontal: "center", vertical: "center" },
        font: { bold: true, color: "#000000", name: "Calibri", size: 12 },
    });

    const center = wb.createStyle({
        alignment: { horizontal: "center", vertical: "center" },
    });

    const leftBold = wb.createStyle({
        alignment: { horizontal: "left", vertical: "center" },
        font: { bold: true, color: "#000000", name: "Calibri", size: 12 },
    });

    const ws: any = wb.addWorksheet("POINTAGE");

    const currentDate: string =
        new Date().getDate() +
        "/" +
        (new Date().getMonth() + 1) +
        "/" +
        new Date().getFullYear();
    const weekAgo: string =
        new Date().getDate() -
        7 +
        "/" +
        (new Date().getMonth() + 1) +
        "/" +
        new Date().getFullYear();

    function getWeekNumber(d: Date): number {
        const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        const dayNum = date.getUTCDay() || 7;
        date.setUTCDate(date.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        return Math.ceil(
            ((date.valueOf() - yearStart.valueOf()) / 86400000 + 1) / 7
        );
    }

    const dateToday: Date = new Date();
    const dateWeekAgo: Date = new Date(
        dateToday.getTime() - 7 * 24 * 60 * 60 * 1000
    );
    const weekAgoWeekNumber: number = getWeekNumber(dateWeekAgo);

    ws.cell(1, 1).string("SNEF").style(centerBoldLarge);
    ws.cell(1, 2, 1, 9, true)
        .string("FEUILLE DE POINTAGE")
        .style(centerBoldLarge);
    ws.cell(2, 2, 2, 8, true)
        .string("NOM : " + name)
        .style(centerBoldMedium);
    ws.cell(2, 9)
        .string(
            "SEMAINE N°" + weekAgoWeekNumber + " du " + weekAgo + " - " + currentDate
        )
        .style(centerBold);

    let carType: string = "";
    let carID: string = "";

    const carDetails = async (name:string) => {
        const { data: staffID, error } = await supabase
            .from('staffID')
            .select('carType, carID')
            .eq("name", name)

        let carType = "" ;
        let carId = "" ;

        if (error) console.log("ERROR : ", error);

        else if (staffID && staffID.length > 0) {
            carType = staffID[0].carType as string ;
            carId = staffID[0].carID as string ;
        }

        console.log("Car Type : ", carType, "Car ID : ", carId)
        return {carType, carId};
    }

    name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ;
    name = name.toLowerCase() ;
    console.log(name) ;

    const carDetailsResult = await carDetails(name) ;
    carType = carDetailsResult.carType as string ;
    carID = carDetailsResult.carId.toString() ;

    ws.cell(3, 9).string("Vehicule " + carType).style(centerBold);
    ws.cell(4, 9).string(carID).style(center);
    ws.cell(3, 1).string("DÉSIGNATION CHANTIER").style(centerBold);
    ws.cell(3, 3).string("PARKING PUBLIC").style(centerBold);
    ws.cell(3, 4).string("PARKING PRIVÉE").style(centerBold);
    ws.cell(3, 5).string("MALADIE").style(centerBold);
    ws.cell(3, 6).string("FERIÉ").style(centerBold);
    ws.cell(3, 7).string("CONGÉS").style(centerBold);
    ws.cell(3, 8).string("TOTAL").style(centerBold);
    ws.cell(4, 1).string("JOURS").style(leftBold);
    ws.cell(4, 2).string("N°").style(center);
    ws.cell(4, 3).string("1WXQ00").style(center);
    ws.cell(4, 4).string("1WXQ10").style(center);
    ws.cell(4, 5).string("XX").style(center);
    ws.cell(4, 6).string("F21007").style(center);
    ws.cell(4, 7).string("XX").style(center);

    const days: any[] = [
        Attendance[0][0],
        Attendance[0][1],
        Attendance[0][2],
        Attendance[0][3],
        Attendance[0][4],
        Attendance[0][5],
        Attendance[0][6],
    ];
    for (let i = 0; i < days.length; i++) {
        ws.cell(5 + i, 1, 5 + i, 2, true)
            .string(days[i])
            .style(leftBold);
    }

    ws.cell(12, 1, 12, 2, true).string("TOTAL").style(leftBold);

    ws.column(1).setWidth(25);
    ws.column(2).setWidth(2.5);
    ws.column(3).setWidth(15);
    ws.column(4).setWidth(15);
    ws.column(5).setWidth(15);
    ws.column(6).setWidth(15);
    ws.column(7).setWidth(15);
    ws.column(8).setWidth(10);
    ws.column(9).setWidth(40);

    // Write values to cells
    for (let i = 0; i < days.length; i++) {
        ws.cell(5 + i, 3)
            .number(Attendance[1][i][0])
            .style(centerBold);
        ws.cell(5 + i, 4)
            .number(Attendance[1][i][1])
            .style(centerBold);
        ws.cell(5 + i, 5)
            .number(Attendance[1][i][2])
            .style(centerBold);
        ws.cell(5 + i, 6)
            .number(Attendance[1][i][3])
            .style(centerBold);
        ws.cell(5 + i, 7)
            .number(Attendance[1][i][4])
            .style(centerBold);
        ws.cell(5 + i, 8)
            .formula("=SUM(C${5 + i}:G${5 + i})")
            .style(centerBold);
    }

    // Calculate totals
    ws.cell(12, 3).formula("=SUM(C5:C11)").style(centerBold);
    ws.cell(12, 4).formula("=SUM(D5:D11)").style(centerBold);
    ws.cell(12, 5).formula("=SUM(E5:E11)").style(centerBold);
    ws.cell(12, 6).formula("=SUM(F5:F11)").style(centerBold);
    ws.cell(12, 7).formula("=SUM(G5:G11)").style(centerBold);
    ws.cell(12, 8).formula("=SUM(H5:H11)").style(centerBold);

    ws.cell(5, 8).formula("=SUM(C5:G5)").style(centerBold);
    ws.cell(6, 8).formula("=SUM(C6:G6)").style(centerBold);
    ws.cell(7, 8).formula("=SUM(C7:G7)").style(centerBold);
    ws.cell(8, 8).formula("=SUM(C8:G8)").style(centerBold);
    ws.cell(9, 8).formula("=SUM(C9:G9)").style(centerBold);
    ws.cell(10, 8).formula("=SUM(C10:G10)").style(centerBold);
    ws.cell(11, 8).formula("=SUM(C11:G11)").style(centerBold);

    ws.cell(13, 1)
        .string("©" + new Date().getFullYear() + " Foton Inc.")
        .style(centerBold);

    return wb;
};

export default getWorksheet;