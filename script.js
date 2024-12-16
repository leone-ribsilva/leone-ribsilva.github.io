// Constantes
const EXPENSE_TYPE = 'expense-type'
const EXPENSE_DATE = 'expense-date'
const PAYMENT_METHOD = 'payment-method'
const EXPENSE_VALUE = 'expense-value'
const CLOSING_DATE = 'closing-date'
const INSTALLMENTS = 'installments'

// Variáveis globais para armazenar despesas e IDs
let expenses = [] // Para exibição na tabela de despesas cadastradas
let allExpenses = [] // Para cálculos
let currentId = 1

//Inicia a página com algumas divs hiddens
document.getElementById('div-expense-table').style.display = 'none'
document.getElementById('monthly-tables').style.display = 'none'

// Função para adicionar uma despesa à lista
function addExpenseToList() {
    const type = document.getElementById(EXPENSE_TYPE).value
    const date = new Date(document.getElementById(EXPENSE_DATE).value)
    const paymentMethod = document.getElementById(PAYMENT_METHOD).value
    const value = parseFloat(document.getElementById(EXPENSE_VALUE).value)
    const closingDate = document.getElementById(CLOSING_DATE).value
    const installments = document.getElementById(INSTALLMENTS).value

    document.getElementById('div-expense-table').style.display = 'block'
    document.getElementById('monthly-tables').style.display = 'block'

    let expense = {
        id: currentId,
        type: type,
        date: date,
        installments: installments,
        closingDate: closingDate,
        paymentMethod: paymentMethod,
        value: value
    }

    if (paymentMethod === 'C.Crédito') {
        handleCreditCardPayment(expense, value, date, installments, closingDate)
    } else {
        handleOtherPayment(expense, date)
    }

    updateTables()
    clearFormFields()
    currentId++
}

function handleCreditCardPayment(
    expense,
    value,
    date,
    installments,
    closingDate
) {
    addInstallmentsToAllExpenses(expense, value, date, installments)

    let installmentExpenseDate = { ...expense }
    let expensesClosingDate = new Date(closingDate)
    expensesClosingDate.setDate(expensesClosingDate.getDate() + 1)
    installmentExpenseDate.closingDate = expensesClosingDate

    let expenseDate = new Date(date)
    expenseDate.setDate(expenseDate.getDate() + 1)
    installmentExpenseDate.date = expenseDate

    expenses.push(installmentExpenseDate) // Adiciona a despesa à lista de despesas para exibição na tabela
}

function handleOtherPayment(expense, date) {
    let oneExpenses = { ...expense }

    let oneExpenseDate = date
    oneExpenseDate.setDate(oneExpenseDate.getDate() + 1)
    oneExpenses.date = oneExpenseDate

    expenses.push(expense) // Adiciona a despesa à lista de despesas para exibição na tabela
    allExpenses.push(expense) // Adiciona a despesa à lista de todas as despesas
}

function addInstallmentsToAllExpenses(expense, value, date, installments) {
    for (let i = 0; i < installments; i++) {
        let installmentExpense = { ...expense }
        installmentExpense.value = value / installments
        let installmentDate = new Date(date)
        installmentDate.setMonth(installmentDate.getMonth() + i)
        installmentExpense.date = installmentDate

        allExpenses.push(installmentExpense) // Adiciona a parcela à lista de todas as despesas
    }
}

// Função para atualizar as tabelas de despesas
function updateTables() {
    updateExpenseTable()
    updateMonthTable()
}

// Função para atualizar a tabela de despesas
function updateExpenseTable() {
    const tableBody = document.getElementById('expense-table-body')

    tableBody.innerHTML = ''

    for (const expense of expenses) {
        var dataCompra = formatDateDayMonthYear(expense.date)

        if (expense.closingDate != null) {
            var dataFechamento = formatDateDayMonthYear(expense.closingDate)
        } else {
            dataFechamento = ''
        }

        const row = document.createElement('tr')
        row.innerHTML = `
            <td id="td0">${expense.type}</td>
            <td>${expense.id}</td>
            <td>${dataCompra}</td>
            <td>${expense.paymentMethod}</td>
            <td>${expense.installments}</td>
            <td>${dataFechamento}</td>
            <td>${expense.value.toFixed(2)}</td>
            <td id="td6"><button class="delete-button"><i class="fas fa-trash" data-id="${
                expense.id
            }"></i></button></td>
        `

        tableBody.appendChild(row)
    }
}

function updateMonthTable() {
    // Atualiza a tabela de despesas por mês
    const selectedMonth = document.getElementById('view-month').value
    const monthlyTableBody = document.getElementById(
        'monthly-expense-table-body'
    )

    monthlyTableBody.innerHTML = ''

    for (const expense of allExpenses) {
        if (expense.date >= selectedMonth) {
            var dataCompra = formatDateMonthYear(expense.date)
            const row = document.createElement('tr')
            row.innerHTML = `
               <td id="td0">${dataCompra}</td>
               <td>${expense.id}</td>
               <td>${expense.type}</td>
               <td id="td6">${expense.value.toFixed(2)}</td>
           `

            monthlyTableBody.appendChild(row)
        }
    }
}

// Função para formatar data para string no formato dia-mês-ano
function formatDateDayMonthYear(date) {
    const data = new Date(date)
    const dia = String(data.getDate()).padStart(2, '0')
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const ano = data.getFullYear()

    if (date == '') {
        return ''
    } else {
        return `${dia}-${mes}-${ano}`
    }
}

// Função para formatar data para string no formato mês-ano
function formatDateMonthYear(date) {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${month}-${year}`
}

// Função para limpar os campos do formulário e ocultar os campos de cartão de crédito
function clearFormFields() {
    document.getElementById('expense-type').value = ''
    document.getElementById('expense-date').value = ''
    document.getElementById('expense-date').type = 'text'
    document.getElementById('payment-method').value = ''
    document.getElementById('expense-value').value = ''
    document.getElementById('installments').value = ''
    document.getElementById('closing-date').value = ''
    document.getElementById('closing-date').type = 'text'

    const creditCardFields = document.getElementById('credit-card-fields')
    creditCardFields.classList.add('hidden')
}

// Função para excluir uma despesa
function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id)
    allExpenses = allExpenses.filter(expense => expense.id !== id)

    let maxId = 0
    for (const expense of allExpenses) {
        if (expense.id > maxId) {
            maxId = expense.id
        }
    }
    console.log(
        'Despesa com id: ' +
            currentId +
            ' excluída antes de atualizar a tabela e limpar os campos'
    )

    currentId = maxId + 1

    updateExpenseTable()
    updateMonthTable()
    clearFormFields()

    console.log(
        'Despesa com id: ' +
            currentId +
            ' excluída após atualizar a tabela e limpar os campos'
    )
}

document.getElementById(PAYMENT_METHOD).addEventListener('change', function () {
    const creditCardFields = document.getElementById('credit-card-fields')
    const selectedPaymentMethod = this.value
    const closingDateInput = document.getElementById('closing-date')

    if (selectedPaymentMethod === 'C.Crédito') {
        creditCardFields.classList.remove('hidden')
        closingDateInput.setAttribute('required', '')
    } else {
        creditCardFields.classList.add('hidden')
        closingDateInput.removeAttribute('required')
    }
})

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('fa-trash')) {
        const id = parseInt(event.target.dataset.id)

        const confirmDelete = confirm(
            'Tem certeza que deseja excluir esta despesa?'
        )

        if (confirmDelete) {
            deleteExpense(id)
        }
    }
})

document
    .getElementById('expense-form')
    .addEventListener('submit', function (e) {
        e.preventDefault()
        addExpenseToList()
    })

updateTables()

document.addEventListener('DOMContentLoaded', function () {
    const dataAtual = new Date()

    const ano = dataAtual.getFullYear()
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0')
    const dia = String(dataAtual.getDate()).padStart(2, '0')

    const dataFormatada = `${ano}-${mes}-${dia}`

    document.getElementById('expense-date').max = dataFormatada
    document.getElementById('closing-date').min = dataFormatada
})

document.getElementById(EXPENSE_VALUE).addEventListener('input', function () {
    var num = this.value.replace(/[^0-9]/g, '')

    num = num.replace(/(\d)(\d{2})$/, '$1,$2')

    this.value = num.replace(',', '.')
})

function displayExpensesForSelectedMonth() {
    const selectedMonth = new Date(document.getElementById('view-month').value)

    if (isNaN(selectedMonth)) {
        updateMonthTable()
    } else {
        const tableBody = document.getElementById('monthly-expense-table-body')
        tableBody.innerHTML = ''

        let totalExpenses = 0

        for (const expense of allExpenses) {
            const expenseDate = new Date(expense.date)
            const expenseMonth = expenseDate.getMonth() - 1
            const expenseYear = expenseDate.getFullYear()

            if (
                expenseMonth === selectedMonth.getMonth() &&
                expenseYear === selectedMonth.getFullYear()
            ) {
                const row = document.createElement('tr')
                row.innerHTML = `
            <td id="td0">${formatDateMonthYear(expense.date)}</td>
            <td>${expense.id}</td>
            <td>${expense.type}</td>
            <td id="td6">${expense.value.toFixed(2)}</td>
        `
                tableBody.appendChild(row)
                totalExpenses += expense.value
            }
        }

        const footerRow = document.createElement('tr')
        footerRow.setAttribute('id', 'tr-footer')
        const footerCell = document.createElement('td')
        footerCell.setAttribute('id', 'td-footer')
        footerCell.setAttribute('colspan', '4')
        footerCell.textContent =
            'Total de Despesas: R$' + totalExpenses.toFixed(2)
        footerRow.appendChild(footerCell)
        tableBody.appendChild(footerRow)

        alternateColorText('td-footer')
    }
}

function alternateColorText(id) {
    // setTimeout(1)
    // document.getElementById(id).setAttribute('color', 'green')
    var t = 0

    for (var i = 0; i <= t; i++) {
        setTimeout(() => {
            document.getElementById(id).style.color = 'red'
        }, 1000)
        t++
    }

    for (var i = 0; i <= t; i++) {
        setTimeout(() => {
            document.getElementById(id).style.color = 'red'
        }, 1000)
        t++
    }
}

document
    .getElementById('view-month')
    .addEventListener('change', displayExpensesForSelectedMonth)
