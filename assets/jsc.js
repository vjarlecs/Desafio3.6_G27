const urlApi = `https://mindicador.cl/api`
const filterCurrencies = ['dolar', 'euro', 'uf', 'utm'];
const divResult = document.querySelector('#result');
const selectWithCurrencies = document.querySelector('#currency')
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);


// obtener las monedas desde la API
const getCurrencies = async () =>{  
    try {
    const reqCurrencies = await fetch(urlApi);
    const resData = await reqCurrencies.json();

// obtener el codigo de las monedas    
    const currencyList = filterCurrencies.map((currency) =>{
    return {
        code: resData[currency].codigo,
        value: resData[currency].valor,
    }    
    });

// mostrar las monedas en el select
currencyList.forEach((currency) =>{
    const option = document.createElement('option');
    option.value = currency.value;
    option.text = capitalize(currency.code);
    selectWithCurrencies.appendChild(option);
});
} catch (error) {
console.log(error);
alert('Error al Obtener las Monedas')
}
};


// calcular el resultado
const calcResult = (amount, currency) => {
 divResult.innerHTML = `$ ${(amount / currency).toFixed(2)} .-`;
};

//dibujar el grafico
const drawChart = async (currency) => {
    try {
        const reqChart = await fetch(`${urlApi}/${currency}`);
        const dataChart = await reqChart.json(); 
        
        const serieToChart = dataChart.serie.slice(0, 10);
        console.log(serieToChart);
    
       
    // crear grafico
     
        const data = {
            labels: serieToChart.map((item) => item.fecha.substring(0, 10)),
            datasets: [{
            label: currency,
            data: serieToChart.map((item) => item.valor),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
      }]
    };
        const config = {
        type: 'line',
        data: data,
      };
    
        const chartDOM = document.querySelector('#chart');
        new Chart(chartDOM, config);
        
    } catch (error) {
        alert('Error al Obtener el Gráfico')
        console.log(error);
    }

}

document.querySelector('#btnConvert').addEventListener('click', () => {
    const amountPesos = document.querySelector('#pesos').value;
    if(amountPesos === ''){
        alert('Debes ingresar un numero para Calcular');
        return;
    }
    const currencySelected = selectWithCurrencies.value;
    const codeCurrencySelected =  
    selectWithCurrencies.options[selectWithCurrencies.selectedIndex
    ].text.toLowerCase();
    
    calcResult(amountPesos, currencySelected);
    drawChart(codeCurrencySelected);
});


getCurrencies();
 