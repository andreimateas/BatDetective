import MenuSideBar from "../MenuSideBar/MenuSideBar";
import "./ReportsPage.css"
import React, {useState} from "react";
import {getAllLocations} from "../API/ApiCalls";
import * as XLSX from "xlsx";

const ReportsPage = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [data, setData] = useState([]);
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(startDate === "" && endDate === ""){
            alert("Please select the dates!");
            return;
        }

        setData(await getAllLocations())

        const filteredData = data.filter(entry => {
            const observationDate = entry.dateAndTimeOfObservation;
            return observationDate >= new Date(startDate) && observationDate <= new Date(endDate);
        }).map(({image,id,...rest})=>rest);

        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        const blob = new Blob([excelBuffer], {type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "report.xlsx");
        document.body.appendChild(link);
        link.dispatchEvent(
            new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window,
            })
        );
        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    return (
        <div className="ReportsWrapper">
            <MenuSideBar/>
            <div className={"FormReportWrapper"}>
                <h2>Generare raport</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <div><label>Data incepere</label><input type="date" value={startDate}
                                                                onChange={(e) => setStartDate(e.target.value)}
                                                                placeholder="Data incepere"/></div>
                        <div><label>Data incheiere</label><input type="date" value={endDate}
                                                                 onChange={(e) => setEndDate(e.target.value)}
                                                                 placeholder="Data incheiere"/></div>
                    </div>
                    <button type='submit'>Genereaza</button>
                </form>
            </div>
        </div>
    )
}

export default ReportsPage;