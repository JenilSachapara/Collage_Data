import React, { useState } from 'react'
import FileSaver, { saveAs } from "file-saver";
import XLSX from 'sheetjs-style'
import { data } from './Data'

const TableData = () => {
    const [tableData, setTableData] = useState(data)
    console.log(tableData)
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
    const selectFilter = () => {

        if (gender) {
            const filterData = tablefilterData.department_data.map((item) => {
                const itemobject = item.year?.map((itm) => {
                    const itmObj = itm.student_data.filter((i) => i.gender === gender)
                    return { student_data: itmObj, year: itm.year, year_head: itm.year_head }
                })
                return { year: itemobject, department: item.department, dep_head: item.dep_head }
            })

            tablefilterData = { collage_name: data.collage_name, department_data: filterData }
        }

        if (department) {
            const filterDepartment = tablefilterData.department_data.filter((i) => department.includes(i.department))
            console.log("filterdepart", filterDepartment)
            tablefilterData = { collage_name: data.collage_name, department_data: filterDepartment }
        }

        if (currentYear) {

            const filterYear = tablefilterData.department_data.map((item) => {
                const yearfilter = item.year.filter((i) => currentYear.includes(i.year))
                console.log("yearfill", yearfilter)
                return { department: item.department, dep_head: item.dep_head, year: yearfilter }
            })

            tablefilterData = { collage_name: data.collage_name, department_data: filterYear }
        }

        if (admissonYear) {
            const filterData = tablefilterData.department_data.map((item) => {
                const itemobject = item.year?.map((itm) => {
                    const itmObj = itm.student_data.filter((i) => admissonYear.includes(i.admission_year))
                    return { student_data: itmObj, year: itm.year, year_head: itm.year_head }
                })
                return { year: itemobject, department: item.department, dep_head: item.dep_head }
            })

            tablefilterData = { collage_name: data.collage_name, department_data: filterData }
        }

        if (selecterMerit) {
            const filterData = tablefilterData.department_data.map((item) => {
                const itemobject = item.year?.map((itm) => {
                    const itmObj = itm.student_data.filter((i) => selecterMerit === 'Greater' ? (i.merit_12th || i.merit_diploma) > inpMerit : (i.merit_12th || i.merit_diploma) < inpMerit)
                    return { student_data: itmObj, year: itm.year, year_head: itm.year_head }
                })
                return { year: itemobject, department: item.department, dep_head: item.dep_head }
            })

            console.log("filterrrrr", filterData)
            tablefilterData = { collage_name: data.collage_name, department_data: filterData }
        }

        if (meritCategory) {
            const filterData = tablefilterData.department_data.map((item) => {
                const itemobject = item.year?.map((itm) => {
                    const itmObj = itm.student_data.filter((i) => (meritCategory === "Regular" && i.hasOwnProperty('merit_12th')) || (meritCategory === "D2D" && i.hasOwnProperty('merit_diploma')))
                    return { student_data: itmObj, year: itm.year, year_head: itm.year_head }
                })
                return { year: itemobject, department: item.department, dep_head: item.dep_head }
            })

            tablefilterData = { collage_name: data.collage_name, department_data: filterData }
        }

        setTableData(tablefilterData)
        console.log("filtered_data", tablefilterData)
    }

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

    return (
        <div className='mx-5 sm:mx-10 md:mx-20'>
            <h3 className='text-center font-bold text-xl py-5'>COLLEGE DATA</h3>
            <div className='mt-4'>

                <div className=' flex items-end justify-center flex-wrap'>
                    <select onChange={(e) => setGender(e.target.value)} value={gender} className="me-5 w-40 h-11 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option selected value="">--Gender--</option>
                        <option value="Male" >Male</option>
                        <option value="Female">Female</option>
                    </select>

                    <select onChange={(e) => setDepartment(Array.from(e.target.selectedOptions, (option) => option.value))} value={department} className="me-5 w-40 h-24 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" multiple>
                        <option selected value="" >--Department--</option>
                        <option value="Computer" >Computer</option>
                        <option value="Automobile">Automobile</option>
                        <option value="Civil">Civil</option>
                    </select>

                    <select onChange={(e) => setCurrentYear(Array.from(e.target.selectedOptions, (option) => option.value))} value={currentYear} className="me-5 w-40 h-24 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" multiple>
                        <option selected value="">--Current Year--</option>
                        <option value="First" >First</option>
                        <option value="Second">Second</option>
                        <option value="Third">Third</option>
                        <option value="Fourth">Fourth</option>
                        <option value="Pass Out">Pass Out</option>
                    </select>

                    <select onChange={(e) => setAdmissonYear(Array.from(e.target.selectedOptions, (option) => option.value))} value={admissonYear} className="me-5 w-40 h-24 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" multiple>
                        <option selected value="">--Admisson Year--</option>
                        <option value="2018" >2018</option>
                        <option value="2019" >2019</option>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                    </select>

                    <div className='flex'>
                        <div className='me-5'>
                            <span for="first_name" className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Merit :</span>

                            <input type="number"
                                id="first_name"
                                max={100}
                                value={inpMerit}
                                onChange={(e) => setInpMerit(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Merit" />
                        </div>

                        <div>
                            <span for="first_name" className=" mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Merit :</span>
                            <select onChange={(e) => setSelecterMerit(e.target.value)} value={selecterMerit} className="w-40 me-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option selected value=''>--Select Merit--</option>
                                <option value="Greater" >{"Greater >"}</option>
                                <option value="Less">{"Less <"} </option>
                            </select>
                        </div>
                    </div>

                    <select onChange={(e) => setMeritCategory(e.target.value)} value={meritCategory} className="mt-5 w-40 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option selected value=''>--Merit Category--</option>
                        <option value="Regular" >Regular</option>
                        <option value="D2D">D2D</option>
                    </select>

                </div>


                <div className='py-5 flex justify-center flex-wrap'>
                    <button onClick={selectFilter} className='mt-5 me-5 bg-cyan-800 text-[15px] border-0 font-bold rounded-md text-white px-6 py-3'>Filter</button>
                    <button className='mt-5 me-5 bg-sky-500 text-[15px] border-0 font-bold rounded-md text-white px-6 py-3' onClick={() => fillIdAndEmail()}>Fill Id & Email</button>
                    <button onClick={matchContact} className='mt-5 me-5 bg-sky-700 text-[15px] border-0 font-bold rounded-md text-white px-6 py-3'>Match Contact</button>
                    <button onClick={sortContact} className='mt-5 me-5 bg-cyan-600 text-[15px] border-0 font-bold rounded-md text-white px-6 py-3'>Sort Contact</button>

                    <select onChange={(e) => sortingMerit(e)} value={sortMerit} className="mt-5 me-5 w-40 h-11 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option selected value="">--Sort Merit--</option>
                        <option value="Ascending" >Ascending</option>
                        <option value="Descending">Descending</option>
                    </select>

                    <button onClick={resetAll} className='mt-5 me-5 bg-green-800 text-[15px] border-0 font-bold rounded-md text-white px-6 py-3'>Reset All</button>

                    <select onChange={(e) => setDownloadFormat(e.target.value)} value={downloadFormat} className="mt-5 me-5 w-40 h-11 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option selected value="">--Download Format--</option>
                        <option value="Csv" >CSV</option>
                        <option value="Excel">Excel</option>
                    </select>
                    <button onClick={downloadFile} className='mt-5 bg-violet-600 text-[15px] border-0 font-bold rounded-md text-white px-6 py-3'>Download!</button>
                </div>
            </div>
            <div className=" my-10 overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                ID
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Contact
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Gender
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Ad Year
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Merit
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Ad Cat
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Collage
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Department
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Dep Head
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Year Head
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Year
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tableData?.department_data.map((item, index) => (
                                <>
                                    {item.year.map((i, ind) => (
                                        <>
                                            {
                                                i.student_data.map((itm, idx) => (
                                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                        <td scope="row" className="px-6 py-4">
                                                            {itm.id}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {itm.student_name}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {itm.email_id}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {itm.contact_number}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {itm.gender}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {itm.admission_year}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {itm.merit_12th || itm.merit_diploma}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {itm.hasOwnProperty('merit_12th') ? "Regular" : "D2D"}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {tableData.collage_name}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {item.department || itm?.department}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {item.dep_head || itm?.dep_head}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {i.year_head || itm?.year_head}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {i.year || itm?.year}
                                                        </td>
                                                    </tr>
                                                ))
                                            }

                                        </>

                                    ))}
                                </>

                            ))
                        }

                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default TableData