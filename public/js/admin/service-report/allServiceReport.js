cursor = 0
latestReportNumber = 0
loadedReports = 0
gotAllreports = false
const totalSearchResults = $('.total-search-results')
$(window).on('scroll', () => {
    if (!gotAllreports) {
        offset = 6
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) {
            if (searchInput.val() == "") {
                getAllServiceReports()
            }
        }
    }
})

keyboardJS.bind('alt + a', (e) => {
    loadedReports = 0
    gotAllreports = false
    if (!$('.view-sale-data-details-modal').hasClass('hide')) {
        checkActiveFilter()
        $('.view-sale-data-details-modal').addClass('hide');
        $('html').removeAttr('style');
        $('.service-machine-modal').addClass('hide');
    }
});

// refresh all the service reports
keyboardJS.bind('r', () => {
    refreshAllReports()
})
searchInput.on('focusin', () => {
    keyboardJS.unbind('r')
})
searchInput.on('focusout', () => {
    keyboardJS.bind('r', () => {
        refreshAllReports()
    })
    keyboardJS.bind('esc', () => {
        $('.service-report-row').removeClass('hovered');
    })
})
keyboardJS.bind('alt + =', (e) => {
    e.preventDefault()
    window.location.replace("/vitco-india/control/service-reports/new-form")
});
// // shortcuts
// keyboardJS.bind('up', (e) => {
//     e.preventDefault()
// }, () => {
//     moveCursor("up")
// });
// keyboardJS.bind('down', (e) => {
//     e.preventDefault()
// }, () => {
//     moveCursor("down")
// });

// keyboardJS.bind('esc', () => {
//     $('.service-report-row').removeClass('hovered');
// })

// async function moveCursor(cmd) {
//     if (cmd == "up") {
//         if (cursor > 0) {
//             row = $(`.row-${$('.service-report-row').length - cursor}`)
//             cursor--
//             $('.service-report-row').removeClass('hovered');
//             $('html, body').animate({ scrollTop: row.offset().top - 20 * 16 }, 100);
//             row.addClass('hovered');
//             keyboardJS.unbind('up')
//             setTimeout(() => {
//                 keyboardJS.bind("up", () => {
//                 }, () => {
//                     moveCursor("up")
//                 })
//             }, 5);

//         }
//     } else if (cmd == "down") {
//         if (cursor <= $('.service-report-row').length - 1) {
//             cursor++
//             row = $(`.row-${$('.service-report-row').length - cursor}`)
//             $('html, body').animate({ scrollTop: row.offset().top - 20 * 16 }, 100);
//             $('.service-report-row').removeClass('hovered');
//             row.addClass('hovered');
//             keyboardJS.unbind('down')
//             setTimeout(() => {
//                 keyboardJS.bind("down", () => {

//                 }, () => {
//                     moveCursor("down")
//                 })
//             }, 5);
//         }
//     }
// }

// setting up advance search 
$('.advance-search').html(``)



dateFilter = $('input[data-filter-type="date"]')
snoFilter = $('input[data-filter-type="sno"]')
machineNoFilter = $('input[data-filter-type="machineNo"]')
// search keyup
$('#search-form input').on('keyup', function (event) {
    $('button[data-bs-toggle="pill"]').removeClass('active')
    if ($('#search-form input').val().length > 0) {
        $('.nav-item[role="presentation"]').removeClass('active')
        $('.addtional-search-options').css('right', '4em')
        query = $('#search-form input').val()
        if (dateFilter.prop('checked')) {
            query = "d: " + query
            searchReport(query)
        } else if (snoFilter.prop('checked')) {
            query = "sn: " + query
            searchReport(query)
        } else if (machineNoFilter.prop('checked')) {
            query = "mn: " + query
            searchReport(query)
        } else {
            searchReport(query)
        }
        $('.open-service-report-filters-btn').removeClass('hide')
        $('.search-add-on-container-btn').removeClass('hide')
    } else {
        loadedReports = 0
        gotAllreports = false
        getAllServiceReports()
    }
})



function ShortifyString(str) {
    str = `${str}`
    if (str.length > 10) {
        return str.substr(0, 10) + ".."
    }
    return str
}
// open service report modal
function viewServiceReport(report) {
    $('html').css('overflow-y', 'hidden');
    $('.service-report-heading').html(`Service Report - ${report.reportNumber}`)
    $('.view-sale-data-details-modal').removeClass('hide')
    $('.service-report-details-data-time').val(`${report.date.split('/')[1]}/${report.date.split('/')[0]}/${report.date.split('/')[2]} ----- ${report.time}`)
    $('.service-report-details-_id').val(`${report._id}`)
    $('.service-report-number').val(`${report.reportNumber}`)
    if (report.createdBy.name != undefined) {
        $('.service-report-details-create-by').val(`${report.createdBy.name}`)
    } else {
        $('.service-report-details-create-by').val(`${report.createdBy}`)
    }
    $('.service-report-details-customer-name').val(`${report.customerName}`)
    $('.service-report-details-mobile').val(`${report.mobile}`)
    $('.service-report-details-tech-name').val(`${report.technicianName}`)
    $('.service-report-details-attend-loc').val(`${report.attendingLocation}`)
    $('.service-report-details-address').val(`${report.address}`)
    const reportLength = report.service.length
    if (reportLength != 0) {
        data = ``
        for (let i = 0; i < reportLength; i++) {
            data += `
                <tr class='cursor-pointer service-report-row' onclick='viewMachineDetails(${JSON.stringify(report.service[i])});toggleServiceReportInputs("machine",true);$(".submit-changes-service-report-machine-details-btn").addClass("hide");$(".change-service-report-machine-details-btn").removeClass("hide")'>
                <td data-label="Machine Name" >${ShortifyString(report.service[i].machineName)}</td>
                <td data-label="Machine Number" >${ShortifyString(report.service[i].machineNum)}</td>
                <td data-label="Warranty" >${ShortifyString(report.service[i].warranty)}</td>
                <td data-label="Problem" >${ShortifyString(report.service[i].problem)}</td>
                <td data-label="Action" >${ShortifyString(report.service[i].actionTaken)}</td>
                <td data-label="Parts IN" >${ShortifyString((report.service[i].partsIN[0].partName != "") ? report.service[i].partsIN[0].partName : "open")}</td>
                <td data-label="Parts OUT">${ShortifyString((report.service[i].partsOUT[0].partName != "") ? report.service[i].partsOUT[0].partName : "open")}</td>
                <td data-label="Status" >${ShortifyString(report.service[i].status)}</td>
                </tr>`
        }
        $('#all-service-machines-table-body').html(data)
    }
    $('.print-service-report-btn').attr('onclick', `window.open('/vitco-india/control/service-reports/print/${report._id}', '_blank')`)
    // $('.customer-signature-img-service-report').attr('src', `${report.customerSignImgDataUrl}`)
    // $('.technician-signature-img-service-report').attr('src', `${report.technicianSignImgDataUrl}`)
}

// open machine details madal
function viewMachineDetails(machine) {
    $('.service-machine-modal').removeClass('hide')
    $('.service-report-machine-details-_id').val(`${machine._id}`)
    $('.service-report-machine-details-machine-name').val(`${machine.machineName}`)
    $('.service-report-machine-details-machine-password').val(`${machine.machinePassword}`)
    $('.service-report-machine-details-machine-number').val(`${machine.machineNum}`)
    $('.service-report-machine-details-wty').val(`${machine.warranty}`)
    $('.service-report-machine-details-prob').val(`${machine.problem}`)
    $('.service-report-machine-details-action').val(`${machine.actionTaken}`)
    partIninputsHtml = ``, partWtyinputsHtml = ``, partOutinputsHtml = ``

    if (machine.partsIN[0][0] == undefined) {
        for (let i = 0; i < machine.partsIN.length; i++) {
            partIninputsHtml += `
            <div class="d-flex">
                <input readonly value="${machine.partsIN[i].partName}" type="text" class="form-control shadow-none service-report-machine-details-parts-in partName my-1" placeholder="enter parts IN">
                <input readonly value="${machine.partsIN[i].partSerialNumber}" type="text" class="form-control shadow-none service-report-machine-details-parts-in partSno my-1" placeholder="enter parts IN">
                <input readonly value="${machine.partsIN[i].partWty}" type="text" class="form-control shadow-none service-report-machine-details-parts-in partWty my-1" placeholder="enter parts IN">
            </div>`
        }
        for (let i = 0; i < machine.partsOUT.length; i++) {
            partWtyinputsHtml += `
            <div class="d-flex">
                <input readonly value="${machine.partsOUT[i].partName}" type="text" class="form-control shadow-none service-report-machine-details-parts-in partsOut my-1" placeholder="enter parts IN">
            </div>`
        }
        $('.parts-in-inputs').html(partIninputsHtml)
        $('.parts-out-inputs').html(partWtyinputsHtml)
    } else {
        partInInputsArr = ''
        partOutInputsArr = ''
        for (let i = 0; i < machine.partsIN.length; i++) {
            tempVar = ""
            for (let j = 0; j < Object.keys(machine.partsIN[i]).length; j++) {
                t = machine.partsIN[i][j]
                ok = Object.keys(machine.partsIN[i])[j]
                if (ok != "partName" && ok != "partSerialNumber" && ok != "partWty") {
                    tempVar += t
                }
            }
            partInInputsArr = tempVar
        }
        for (let i = 0; i < machine.partsOUT.length; i++) {
            tempVar = ""
            for (let j = 0; j < Object.keys(machine.partsOUT[i]).length; j++) {
                t = machine.partsOUT[i][j]
                ok = Object.keys(machine.partsOUT[i])[j]
                if (ok != "partName" && ok != "partSerialNumber" && ok != "partWty") {
                    tempVar += t
                }
            }
            partOutInputsArr = tempVar
        }
        partin = partInInputsArr.split(" ?>> ")
        partout = partOutInputsArr.split(" ?>> ")
        partWty = (machine.partWarranty != undefined) ? machine.partWarranty.split(" ?>> ") : "No data"
        for (let i = 0; i < partin.length; i++) {
            partIninputsHtml += `
            <div class="d-flex">
                <input readonly value="${partin[i]}" type="text" class="form-control shadow-none service-report-machine-details-parts-in partName my-1" placeholder="enter parts name">
                <input readonly value="" type="text" class="form-control shadow-none service-report-machine-details-parts-in partSno my-1" placeholder="enter parts sno">
                <input readonly value="${(typeof partWty == 'object') ? partWty[i] : "null"}" type="text" class="form-control shadow-none service-report-machine-details-parts-in partWty my-1" placeholder="enter parts wty">
            </div>`
        }
        for (let i = 0; i <= partout.length; i++) {
            if (partout[i] != '' && partout[i] != undefined) {
                partOutinputsHtml += `
                <div class="d-flex">
                    <input readonly value="${partout[i]}" type="text" class="form-control shadow-none service-report-machine-details-parts-in partsOut my-1" placeholder="enter parts out">
                </div>`
            }
        }
        $('.parts-in-inputs').html(partIninputsHtml)
        $('.parts-out-inputs').html(partOutinputsHtml)
    }


    $('.service-report-machine-details-status').val(`${machine.status}`)
}


// update service report table
async function updateServiceReportTable(reports) {
    if (reports.length == 0) {
        $('.no-results-found-text').removeClass('hide')
    } else {
        $('.no-results-found-text').addClass('hide')
    }
    data = ``
    for (var i = reports.length - 1; i >= 0; i--) {
        data += `
        <tr class='cursor-pointer service-report-row row-${i}' onclick='viewServiceReport(${JSON.stringify(reports[i])});toggleServiceReportInputs("report",true);$(".submit-changes-service-report-btn").addClass("hide");$(".change-service-report-btn").removeClass("hide")'>
         <td class="user-select-none" data-label="Report Number" >${ShortifyString(reports[i].reportNumber)}</td>
         <td class="user-select-none" data-label="Date" >${ShortifyString(`${reports[i].date.split('/')[1]}/${reports[i].date.split('/')[0]}/${reports[i].date.split('/')[2]}`)}</td>
         <td class="user-select-none" data-label="Customer name" >${ShortifyString(reports[i].customerName)}</td>
         <td class="user-select-none" data-label="Mobile number" >${ShortifyString(reports[i].mobile)}</td>
         <td class="user-select-none" data-label="Address" >${ShortifyString(reports[i].address)}</td>
         <td class="user-select-none" data-label="Total Machines" >${ShortifyString(reports[i].service.length)}</td>
         <td class="user-select-none" data-label="Tech. Name" >${ShortifyString(reports[i].technicianName)}</td>
         <td class="user-select-none" data-label="Attd. Loc." >${ShortifyString(reports[i].attendingLocation)}</td>
        </tr>
        `
    }
    $('#all-service-reports-body').html(data)
}


// get all service reports
async function getAllServiceReports() {
    totalSearchResults.addClass('hide')
    $('.nav-link-all').addClass('active')
    $('.addtional-search-options').css('right', '1em')
    $('.open-service-report-filters-btn .bi-funnel-fill').removeClass('hide');
    $('.open-service-report-filters-btn .bi-x-lg').addClass('hide')
    searchInput.val('')
    $('.all-service-report-filters').addClass('hide')
    $('.service-report-filter').prop('checked', false);
    $('.open-service-report-filters-btn').addClass('hide')
    $('.service-report-loading').removeClass('hide')
    await axios.get('/api/v1/service-report/get-report-number')
        .then((response) => {
            latestReportNumber = response.data.reportNumber
        })
    loadedReports += 20
    from = latestReportNumber - loadedReports
    to = latestReportNumber

    if (from > 20) {
        await axios.get(`/api/v1/service-report/all/${from}/${to}`)
            .then((response) => {
                $('.service-report-loading').addClass('hide')
                updateServiceReportTable(response.data.machines)
            })
    } else {
        $('.service-report-loading').addClass('hide')
        if (gotAllreports == false) {
            await axios.get(`/api/v1/service-report/all/0/${to}`)
                .then((response) => {
                    gotAllreports = true
                    updateServiceReportTable(response.data.machines)
                })
        }
    }


}
getAllServiceReports()

// search service reports
async function searchReport(query) {

    $('.service-report-loading').removeClass('hide')
    totalSearchResults.removeClass('hide')
    axios.post(`/api/v1/service-report/search/${query.replaceAll('/', '-')}`)
        .then((response) => {
            if (response.data.reports.length == 0) {
                totalSearchResults.html(`No results found`)
            } else if (response.data.reports.length == 1) {
                totalSearchResults.html(`${response.data.reports.length} result found`)
            } else {
                totalSearchResults.html(`${response.data.reports.length} results found`)
            }
            $('.service-report-loading').addClass('hide')
            updateServiceReportTable(response.data.reports)
        })
}

$('[data-toggle="popover"]').popover();


$('#advanceSearchModal').on('hidden.bs.modal', function () {
    $('.totalResult').html('')
});

// advance search
$('#advance-serach-form').on('submit', (e) => {
    e.preventDefault()
    searchInput.val('')
    formData = $('#advance-serach-form').serializeArray()
    axios({
        method: "post",
        url: "/api/v1/service-report/search/cond:",
        data: formData,
    })
        .then(function (response) {
            $('.modal-backdrop').remove();
            $('.totalResult').html(`${response.data.reports.length} results found`)
            updateServiceReportTable(response.data.reports)
        })
})






//toggle service report input read only
async function toggleServiceReportInputs(form, value) {
    if (form == "report") {
        $('.service-report-details-customer-name').attr("readonly", value)
        $('.service-report-details-mobile').attr("readonly", value)
        $('.service-report-details-tech-name').attr("readonly", value)
        $('.service-report-details-attend-loc').attr("readonly", value)
        $('.service-report-details-address').attr("readonly", value)
        $('.service-report-details-password').attr("readonly", value)
    } else if (form == "machine") {
        $('.service-report-machine-details-machine-name').attr('readonly', value)
        $('.service-report-machine-details-machine-number').attr('readonly', value)
        $('.service-report-machine-details-machine-password').attr('readonly', value)
        $('.service-report-machine-details-wty').attr('readonly', value)
        $('.service-report-machine-details-prob').attr('readonly', value)
        $('.service-report-machine-details-action').attr('readonly', value)
        $('.service-report-machine-details-parts-in').attr('readonly', value)
        $('.service-report-machine-details-parts-out').attr('readonly', value)
        $('.service-report-machine-details-status').attr('readonly', value)
    }
}


// update service report
async function saveServiceReport() {
    axios.post(`/api/v1/service-report/update/report/${$('.service-report-details-_id').val()}`, {
        customerName: $('.service-report-details-customer-name').val(),
        mobile: $('.service-report-details-mobile').val(),
        technicianName: $('.service-report-details-tech-name').val(),
        attendingLocation: $('.service-report-details-attend-loc').val(),
        address: $('.service-report-details-address').val(),
    }).then((response) => {
        if (response.data.success) {
            $('.submit-changes-service-report-btn').addClass('hide');
            $('.change-service-report-btn').removeClass('hide')
            $('.all-service-machines-table').removeClass('hide')

            toggleServiceReportInputs("report", true)
            viewServiceReport(response.data.report[0])
            loadedReports = 0
            gotAllreports = false
            getAllServiceReports()
        }
    })
}

async function saveReportMachinesDetails() {
    let tempPartName = $('.partName').map(function () { return this.value; }).get();
    let tempPartSno = $('.partSno').map(function () { return this.value; }).get();
    let tempPartWty = $('.partWty').map(function () { return this.value; }).get();
    let partsIn = []
    for (let i = 0; i < tempPartName.length; i++) {
        partsIn.push({
            partName: tempPartName[i],
            partSerialNumber: tempPartSno[i],
            partWty: tempPartWty[i],
        })
    }
    const id = $('.service-report-machine-details-_id').val()
    axios.post(`/api/v1/service-report/update/machine/${$('.service-report-machine-details-_id').val()}`, {
        'service.$.machineName': $('.service-report-machine-details-machine-name').val(),
        'service.$.machineNum': $('.service-report-machine-details-machine-number').val(),
        'service.$.machinePassword': $('.service-report-machine-details-machine-password').val(),
        'service.$.warranty': $('.service-report-machine-details-wty').val(),
        'service.$.problem': $('.service-report-machine-details-prob').val(),
        'service.$.actionTaken': $('.service-report-machine-details-action').val(),
        'service.$.partsIN': partsIn,
        'service.$.partsOUT': $('.partsOut').map(function () { return { partName: this.value }; }).get(),
        'service.$.status': $('.service-report-machine-details-status').val(),
    }).then((response) => {
        if (response.data.success) {
            $('.submit-changes-service-report-machine-details-btn').addClass('hide');
            $('.change-service-report-machine-details-btn').removeClass('hide')
            $('.add-new-parts-in').addClass('hide')
            $('.add-new-parts-out').addClass('hide')
            toggleServiceReportInputs("machine", true)
            response.data.report[0].service.forEach(machine => {
                if (machine._id == id) {
                    viewMachineDetails(machine)
                }
            });
            viewServiceReport(response.data.report[0])
            loadedReports = 0
            gotAllreports = false
            getAllServiceReports()
        }
    })
}

// refresh data
function filterReports(query, base) {
    searchInput.val(query)
    $('#all-service-reports-body').html('')
    $('.service-report-loading').removeClass('hide')
    searchReport("filter: " + query + " =>on " + base)
}


function checkActiveFilter() {
    if ($('.nav-link-ok').hasClass('active')) {
        filterReports('OK', 'status')
    } else if ($('.nav-link-pending').hasClass('active')) {
        filterReports('Pending', 'status')
    } else {
        $('#all-reports-header table').css('display', 'none');
        setTimeout(() => {
            loadedReports = 0;
            gotAllreports = false;
            $('#all-reports-header table').css('display', 'inline-table');
        }, 100);
	getAllServiceReports()
    }
}


// refresh data
function refreshAllReports() {
    window.scrollTo(0, 0);
    searchInput.val('');
    $('#all-reports-header table').css('display', 'none');
    setTimeout(() => {
        loadedReports = 0;
        gotAllreports = false;
        $('#all-reports-header table').css('display', 'inline-table');
        checkActiveFilter()
    }, 100);
}

// open filter menu
function openFilterMenu() {

    $('.all-service-report-filters').removeClass('hide');
    $('.open-service-report-filters-btn .bi-funnel-fill').addClass('hide');
    $('.open-service-report-filters-btn .bi-x-lg').removeClass('hide')
    $('.search-add-on-container').addClass('hide')
}
// open filter menu
function closeFilterMenu() {
    $('.all-service-report-filters').addClass('hide');
    $('.open-service-report-filters-btn .bi-funnel-fill').removeClass('hide');
    $('.open-service-report-filters-btn .bi-x-lg').addClass('hide')
}

const createCombinationHtml = $('.create-combination-container').html()
function addNewAdvanceSearchInput(value) {
    if (value == "combination") {
        $('.create-combination-container').append(createCombinationHtml)
    } else if (value == "clear") {
        $('.create-combination-container').html(createCombinationHtml)
    }
}



// // open filter menu
// function openAdvanceSearch() {
//     closeFilterMenu()
//     $('.search-add-on-container').removeClass('hide');
//     $('.search-add-on-container-btn .bi-plus-square').addClass('hide');
//     $('.search-add-on-container-btn .bi-x-lg').removeClass('hide')
// }
// // open filter menu
// function closeAdvanceSearch() {
//     $('.search-add-on-container').addClass('hide');
//     $('.search-add-on-container-btn .bi-plus-square').removeClass('hide');
//     $('.search-add-on-container-btn .bi-x-lg').addClass('hide')
// }
