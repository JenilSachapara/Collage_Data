import { useState } from "react"
import { data } from "./Data"
import FileSaver from "file-saver";
import XLSX from 'sheetjs-style'

const TableDataHook = () => {
    const [tableData, setTableData] = useState(data)
    const [gender, setGender] = useState()
    const [department, setDepartment] = useState()
    const [currentYear, setCurrentYear] = useState()
    const [admissonYear, setAdmissonYear] = useState()
    const [inpMerit, setInpMerit] = useState()
    const [selecterMerit, setSelecterMerit] = useState()
    const [sortMerit, setSortMerit] = useState()
    const [meritCategory, setMeritCategory] = useState()
    const [downloadFormat, setDownloadFormat] = useState()
    let tablefilterData = data

    const filterByGender = (data, gender) => {
        return data.map((item) => ({
            ...item,
            year: item.year?.map((itm) => ({
                ...itm,
                student_data: itm.student_data.filter((i) => i.gender === gender),
            })),
        }));
    };

    const filterByDepartment = (data, department) => {
        return data.filter((i) => department.includes(i.department));
    };

    const filterByYear = (data, currentYear) => {
        return data.map((item) => ({
            ...item,
            year: item.year.filter((i) => currentYear.includes(i.year)),
        }));
    };

    const filterByAdmissionYear = (data, admissonYear) => {
        return data.map((item) => ({
            ...item,
            year: item.year?.map((itm) => ({
                ...itm,
                student_data: itm.student_data.filter((i) => admissonYear.includes(i.admission_year)),
            })),
        }));
    };

    const filterByMerit = (data, selecterMerit, inpMerit) => {
        return data.map((item) => ({
            ...item,
            year: item.year?.map((itm) => ({
                ...itm,
                student_data: itm.student_data.filter((i) => (
                    (selecterMerit === 'Greater' ? (i.merit_12th || i.merit_diploma) > inpMerit : (i.merit_12th || i.merit_diploma) < inpMerit)
                )),
            })),
        }));
    };

    const filterByMeritCategory = (data, meritCategory) => {
        return data.map((item) => ({
            ...item,
            year: item.year?.map((itm) => ({
                ...itm,
                student_data: itm.student_data.filter((i) => (
                    (meritCategory === "Regular" && i.hasOwnProperty('merit_12th')) || (meritCategory === "D2D" && i.hasOwnProperty('merit_diploma'))
                )),
            })),
        }));
    };

    const selectFilter = () => {
        let filteredData = [...tablefilterData.department_data];

        if (gender) {
            filteredData = filterByGender(filteredData, gender);
        }

        if (department) {
            filteredData = filterByDepartment(filteredData, department);
        }

        if (currentYear) {
            filteredData = filterByYear(filteredData, currentYear);
        }

        if (admissonYear) {
            filteredData = filterByAdmissionYear(filteredData, admissonYear);
        }

        if (selecterMerit) {
            filteredData = filterByMerit(filteredData, selecterMerit, inpMerit);
        }

        if (meritCategory) {
            filteredData = filterByMeritCategory(filteredData, meritCategory);
        }

        setTableData({ collage_name: data.collage_name, department_data: filteredData });
        console.log("filtered_data", filteredData);
    };

    const resetAll = () => {
        setTableData(tablefilterData)
        setGender('');
        setDepartment('');
        setCurrentYear('');
        setAdmissonYear('')
        setInpMerit('');
        setSelecterMerit('');
        setSortMerit('');
        setMeritCategory('')
        setDownloadFormat('')
    }

    const fillIds = (studentData, key) => {
        let collectIds = JSON.parse(JSON.stringify(studentData)).filter(ele => ele.hasOwnProperty(key)).map((student) => student?.id ? parseInt(student?.id.split('_')[key === 'merit_diploma' ? 2 : 1]) : 'null')

        let missingNumbers = []
        let numbers = collectIds.filter(ele => ele !== 'null')

        for (let i = 1; i <= collectIds?.length; i++) {
            if (!(numbers.includes(i))) {
                missingNumbers.push(i);
            }
        }
        let nonFillId = JSON.parse(JSON.stringify(studentData)).filter(el => (el.hasOwnProperty(key) && (el?.id === '' || el?.id === undefined)));

        let regularDataID = JSON.parse(JSON.stringify(nonFillId)).map((student, index) => {
            student.id = key === 'merit_diploma' ? `${student.admission_year}_0_${missingNumbers[index]}` : `${student.admission_year}_${missingNumbers[index]}`
            return { ...student };
        })
        let fiiledIdData = JSON.parse(JSON.stringify(studentData)).map(ele => {
            if (!ele.id) {
                let fillId = regularDataID.find(data => data?.student_name === ele?.student_name);
                ele.id = fillId?.id;
                ele.email_id = `${ele.student_name.replaceAll(" ", "_").toLowerCase()}_${fillId?.id}@gmail.com`
            }
            return { ...ele }
        });
        return fiiledIdData;
    }

    const fillIdAndEmail = () => {
        let d = tableData.department_data.map((item) => {
            let year = item.year.map((itm) => {
                let fillRegularData = fillIds(JSON.parse(JSON.stringify(itm.student_data)), 'merit_12th')
                let fillD2DData = fillIds(JSON.parse(JSON.stringify(fillRegularData)), 'merit_diploma')
                return { ...itm, student_data: fillD2DData }
            })
            return { ...item, year: year }
        })
        let data1 = { collage_name: data.collage_name, department_data: d }

        setTableData(data1);
    }

    const matchContact = () => {

        let repeatedContacts = [];
        let stu = [];

        tableData.department_data.forEach((item) => {
            item.year.forEach((itm) => {
                let contacts = itm?.student_data.map(ele => ele.contact_number)
                contacts.forEach((ele, index) => {
                    if (!stu.includes(ele) && index !== contacts.lastIndexOf(ele)) {
                        stu.push(ele);
                    }
                })

            })
        })

        if (stu.length) {
            repeatedContacts = tableData.department_data.map((department) => {
                let d = department.year.map(year => {
                    let data = year.student_data.filter(ele => stu.includes(ele.contact_number))
                    return { ...year, student_data: data }
                })
                return { ...department, year: d }
            })
        }

        let setttdata = { collage_name: data.collage_name, department_data: repeatedContacts }
        setTableData(setttdata)
    }

    const sortContact = () => {
        let array = []
        tableData.department_data.map((item) => (
            item.year.map((itm) => (
                itm.student_data.map((i) => (
                    array.push({ ...i, year: itm.year, year_head: itm.year_head, department: item.department, dep_head: item.dep_head })
                ))
            ))
        ))


        const flatData = array.flat()
        const sortData = flatData.sort((a, b) => {
            let fa = a.contact_number.toLowerCase(),
                fb = b.contact_number.toLowerCase();

            if (fa < fb) {
                return -1;
            }
            if (fa > fb) {
                return 1;
            }
            return 0;
        })

        // console.log("flatData", flatData, sortData)

        let setttdata = { collage_name: data.collage_name, department_data: [{ year: [{ student_data: sortData }] }] }
        console.log("settt", setttdata)
        setTableData(setttdata)
    }


    const sortingMerit = (e) => {
        setSortMerit(e.target.value);

        let arr = []
        console.log("table", tableData)
        tablefilterData?.department_data.map((item) => (
            item?.year.map((itm) => (
                itm?.student_data.map((i) => (
                    arr.push({ ...i, year: itm.year, year_head: itm.year_head, department: item.department, dep_head: item.dep_head })
                ))
            ))
        ))
        const flatData = arr.flat()
        console.log("flat", flatData)
        const sortdata = flatData.sort((a, b) => {
            if (sortMerit === 'Descending') {
                return (a.merit_12th || a.merit_diploma) - (b.merit_12th || b.merit_diploma);
            } else {
                return (b.merit_12th || b.merit_diploma) - (a.merit_12th || a.merit_diploma);
            }
        });

        let setttmerit = { collage_name: data.collage_name, department_data: [{ year: [{ student_data: sortdata }] }] }
        console.log("sorttttt", sortdata)
        setTableData(setttmerit)
    };

    const downloadFile = () => {

        let array = []
        tableData.department_data.map((item) => (
            item.year.map((itm) => (
                itm.student_data.map((i) => (
                    array.push({ ...i, year: itm.year, year_head: itm.year_head, department: item.department, dep_head: item.dep_head })
                ))
            ))
        ))
        const flatData = array.flat()

        if (downloadFormat === "Excel") {

            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
            const fileExtension = '.xlsx';

            const ws = XLSX.utils.json_to_sheet(flatData);
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, "table_data_excel" + fileExtension);

        } else {
            // var blobCsv = new Blob([JSON.stringify(tableData)], { type: "text/plain;charset=utf-8" });
            // FileSaver.saveAs(blobCsv, "table_data.csv");

            const fileType = 'application/plain;charset=UTF-8';
            const fileExtension = '.csv';

            const ws = XLSX.utils.json_to_sheet(flatData);
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'csv', type: 'array' });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, "table_data" + fileExtension);
        }
    }

    return ({
        tableData, gender, setGender, department, setDepartment, currentYear, setCurrentYear, admissonYear, setAdmissonYear, inpMerit, setInpMerit, selecterMerit, setSelecterMerit, sortMerit, meritCategory, setMeritCategory, downloadFormat, setDownloadFormat, resetAll, selectFilter, fillIdAndEmail, matchContact,
        sortingMerit, sortContact, downloadFile
    })
}

export default TableDataHook