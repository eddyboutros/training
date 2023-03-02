const currYear = document.getElementById("year");
currYear.innerHTML = new Date().getFullYear().toString();

function loadData()
{
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data =>
		{
            var form = document.getElementById("formElement");
            var select = document.createElement("select");

            select.type = "text";
            select.id = "country";
            select.name = "country";
            form.appendChild(select);

            var countries = document.getElementById("country");
            var option = document.createElement("option");
            var flag = document.createElement("img");
            var keys;
            countries.style = "border-radius: 4px;";

            for (let i = 0; i < data.length; i++)
			{
                if (data[i].hasOwnProperty("currencies"))
				{
                    keys = Object.keys(data[i].currencies);
                    option.id = data[i].cca2;
                    option.value = data[i].cca2 + ":" + keys.join(", ");
                    option.style = "background-image: url(" + data[i].flags.png + "); padding-left: 30px; background-size: contain";
                    option.innerHTML = data[i].name.common;
                    countries.appendChild(option);
                    option = document.createElement("option");
                }
            }

            var button = document.createElement("button");

            countries.onchange = function(entry)
			{
                let buttons = document.querySelectorAll("button");
				let labels = document.querySelectorAll("label");

                buttons.forEach((button) =>
				{
                    if (button.id.startsWith("curr_"))
					{
                        button.remove();
                    }
                });

				labels.forEach((label) =>
				{
                    if (label.id.startsWith("lbl_"))
					{
                        label.remove();
                    }
                });

                button.innerText = entry.target.value;
                console.log(entry.target.value);

                var countryCurrencies = entry.target.value
                var theCurrencies = countryCurrencies.split(":")[1];
                var currencyArray = theCurrencies.split(",");
                var currSize = currencyArray.length;

                for (let i = 0; i < currSize; i++)
				{
                    button.textContent = currencyArray[i].trim();
                    button.id = "curr_" + button.textContent;
                    button.classList.add("button");
					var label = document.createElement("label");

					button.onclick = function(event)
					{
						console.log(event);
						const apiKey = "pJszQnMmvO6ucnSZapcGBEkMb6bFMs3G";
						const url = "https://api.apilayer.com/exchangerates_data/convert?to=USD&from=" + event.target.textContent + "&amount=1";
						var myHeaders = new Headers();
						myHeaders.append("apikey", apiKey);

						var requestOptions = {
						  method: 'GET',
						  redirect: 'follow',
						  headers: myHeaders
						};

						fetch(url, requestOptions)
							.then(response => response.json())
							.then(data => {
								console.log(data);
								label.for = button.id;
								label.id = "lbl_" + button.id;
								label.innerHTML = "1 " + event.target.textContent + " = "  + data.result + " USD";
							})
							.catch(error => console.error(error));
					}

					form.appendChild(button);
					form.appendChild(label);
                    button = document.createElement("button");
                }
            };
        });
}