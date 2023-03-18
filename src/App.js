import { useEffect, useState } from "react";
import weatherImage from "./assets/images/weather.png";
import useCurrentLocation from "./hooks/useCurrentLocation";
import axios from "axios";
import moment from "moment";
import { WEATHER_API_URL } from "./utils/constants";

function App() {
  const [city, setCity] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const { lat, lng } = useCurrentLocation();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  const getWeather = (latVal, lngVal) => {
    if (latVal && lngVal) {
      axios
        .get(
          `${WEATHER_API_URL}?latitude=${latVal}&longitude=${lngVal}&current_weather=true&daily=rain_sum,temperature_2m_min,windspeed_10m_min&timezone=GMT`
        )
        .then((response) => setData(response?.data))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    setLoading(true);
    getWeather(lat, lng);
  }, [lat, lng]);

  useEffect(() => {
    setLoading(true);
    getWeather(latitude, longitude);
  }, [latitude, longitude]);

  console.log("lat", lat, lng, latitude, longitude);

  const onSearch = () => {
    axios
      .get(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
      .then((response) => {
        setLatitude(response?.data?.results?.[0]?.latitude);
        setLongitude(response?.data?.results?.[0]?.longitude);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  console.log("weather", data);
  return (
    <div className="flex justify-center content-center min-h-screen bg-sky-200">
      <div className="w-1/2 md:w-1/4 grid place-items-center bg-gray-100 rounded shadow-sm p-5">
        <div>
          <h2 className="text-2xl font-bold text-yellow-400 ">
            Weather Forecast App
          </h2>
          <span className="text-xs">{moment().format("llll")}</span>

          {/* Search by city form */}
          <div className="my-3">
            <input
              className="rounded shadow-sm p-2"
              type="text"
              value={city}
              placeholder="Search by city"
              onChange={(e) => {
                if (e.target.value) {
                  setCity(e.target.value);
                }
              }}
            />
            <button
              type="button"
              onClick={onSearch}
              className="bg-sky-400 text-white p-2"
            >
              Search
            </button>
          </div>

          {/* Today temperature */}
          <div className="flex justify-center py-3">
            <div>
              <img src={weatherImage} alt="show weather" />
            </div>
            <div>
              <h3 className="text-yellow-400 font-bold text-3xl">
                {data?.current_weather?.temperature ?? "0"} &#8451;
                {/* |
                Partly cloudy */}
              </h3>
            </div>
          </div>

          {/* Today Weather Info */}

          {loading ? (
            "Loading..."
          ) : (
            <div>
              <h4 className="my-3 font-medium">Current Weather Info</h4>
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                <div className="p-2 rounded-sm border">
                  <div className="text-xs text-gray-500">wind speed</div>
                  <div className="font-bold">
                    {data?.current_weather?.windspeed ?? "-"} km / h
                  </div>
                </div>

                <div className="p-2 rounded-sm border">
                  <div className="text-xs text-gray-500">wind direction</div>
                  <div className="font-bold">
                    {data?.current_weather?.winddirection ?? "-"} &deg;
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Weekly Weather Info */}
          {data?.daily && !loading ? (
            <div>
              <h4 className="my-3 font-medium">Weekly Weather Forecast</h4>
              <div className="grid grid-cols-1 gap-2">
                {Array.from({ length: 6 }, (_i, arr) => (
                  <div className="p-2 rounded-sm border flex justify-between">
                    <div>
                      <div className="text-xs text-gray-500">
                        {moment(data?.daily?.time[arr + 1]).format("ll")}
                      </div>
                      <div className="font-bold">
                        {data?.daily?.windspeed_10m_min[arr + 1] ?? "-"}
                        &nbsp;km / h
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div>
                        <img
                          src={weatherImage}
                          alt="show weather"
                          width={30}
                          height={30}
                        />
                      </div>
                      <div>
                        <h3 className="text-yellow-400 font-bold">
                          {data?.daily?.temperature_2m_min[arr + 1] ?? "0"}{" "}
                          &#8451;
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
