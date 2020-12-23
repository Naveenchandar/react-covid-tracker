import React, { useState, useEffect } from "react";
import "../App.css";
import {
    MenuItem,
    FormControl,
    Select,
    Grid
} from "@material-ui/core";
import InfoBox from "./InfoBox/InfoBox";
import LineGraph from "./LineGraph/LineGraph";
import Table from "./Table/Table";
import { sortData, prettyPrintStat } from "./Helper/util";
import numeral from "numeral";
import Map from "./Map/Map";
import "leaflet/dist/leaflet.css";

const Index = () => {
    const [country, setInputCountry] = useState("worldwide");
    const [countryInfo, setCountryInfo] = useState({});
    const [countries, setCountries] = useState([]);
    const [mapCountries, setMapCountries] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [casesType, setCasesType] = useState("cases");
    const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
    const [mapZoom, setMapZoom] = useState(2);

    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
            .then((response) => response.json())
            .then((data) => {
                setCountryInfo(data);
            });
    }, []);

    useEffect(() => {
        const getCountriesData = async () => {
            fetch("https://disease.sh/v3/covid-19/countries")
                .then((response) => response.json())
                .then((data) => {
                    const countries = data.map((country) => ({
                        name: country.country,
                        value: country.countryInfo.iso2,
                    }));
                    let sortedData = sortData(data);
                    setCountries(countries);
                    setMapCountries(data);
                    setTableData(sortedData);
                });
        };

        getCountriesData();
    }, []);

    const onCountryChange = async (e) => {
        const countryCode = e.target.value;

        const url =
            countryCode === "worldwide"
                ? "https://disease.sh/v3/covid-19/all"
                : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setInputCountry(countryCode);
                setCountryInfo(data);
                setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
                setMapZoom(4);
            });
    };

    return (
        <div className="app">
            <div className="app__header">
                <h1>COVID-19 Tracker</h1>
            </div>
            <Grid container spacing={3}>
                <Grid xs={12} sm={12} className='app__gridlayout1'>
                    <div className='app__info'>
                        <FormControl className="app__dropdown">
                            <Select
                                variant="outlined"
                                value={country}
                                onChange={onCountryChange}
                            >
                                <MenuItem value="worldwide">Worldwide</MenuItem>
                                {countries.map((country) => (
                                    <MenuItem value={country.value}>{country.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div className="app__stats">
                            <InfoBox
                                onClick={(e) => setCasesType("cases")}
                                title="Coronavirus Cases"
                                isRed
                                active={casesType === "cases"}
                                cases={prettyPrintStat(countryInfo.todayCases)}
                                total={numeral(countryInfo.cases).format("0.0a")}
                            />
                            <InfoBox
                                onClick={(e) => setCasesType("recovered")}
                                title="Recovered"
                                active={casesType === "recovered"}
                                cases={prettyPrintStat(countryInfo.todayRecovered)}
                                total={numeral(countryInfo.recovered).format("0.0a")}
                            />
                            <InfoBox
                                onClick={(e) => setCasesType("deaths")}
                                title="Deaths"
                                isRed
                                active={casesType === "deaths"}
                                cases={prettyPrintStat(countryInfo.todayDeaths)}
                                total={numeral(countryInfo.deaths).format("0.0a")}
                            />
                        </div>
                    </div>
                    <LineGraph casesType={casesType} title={`Worldwide new ${casesType}`} />
                </Grid>
                <Grid xs={12} sm={12} className='app__gridlayout2'>
                    <Grid item xs={12} sm={6} className="app__table">
                        <Table countries={tableData} title='Live Cases by Country' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Map
                            countries={mapCountries}
                            casesType={casesType}
                            center={mapCenter}
                            zoom={mapZoom}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </div >
    );
};

export default Index;