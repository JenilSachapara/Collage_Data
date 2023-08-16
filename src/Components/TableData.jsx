import React from 'react'
import TableDataHook from './tableDataHook';

const TableData = () => {
    const { tableData, gender, setGender, department, setDepartment, currentYear, setCurrentYear, admissonYear, setAdmissonYear, inpMerit, setInpMerit, selecterMerit, setSelecterMerit, sortMerit, meritCategory, setMeritCategory, downloadFormat, setDownloadFormat, resetAll, selectFilter, fillIdAndEmail, matchContact,
        sortingMerit, sortContact, downloadFile } = TableDataHook()

    const FilterHeaders = () => {
        return (
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
        )
    }

    return (
        <div className='mx-5 sm:mx-10 md:mx-20'>
            <h3 className='text-center font-bold text-xl py-5'>COLLEGE DATA</h3>
            {FilterHeaders()}
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