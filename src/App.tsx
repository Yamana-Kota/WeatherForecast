import { useState, useEffect } from 'react';
import WeatherCard from './WeatherCard';
import { WeatherData } from './types';
import apiClient from './api';

const App = () => {
    // 天気情報のstate：types.tsで定義した型（WeatherData）を使用して型定義
    const [weather, setWeather] = useState<WeatherData | null>(null);
    // エラーメッセージを管理するstate：string型またはnull型を使用して型定義
    const [error, setError] = useState<string | null>(null);

    console.log(weather);

    // コンポーネントが表示されたときに一度だけ実行され、APIから天気データを取得
    useEffect(() => {
        // 天気情報を取得する非同期関数
        const fetchWeather = async () => {
            try {
                // Axiosを使って天気APIからデータを取得：ジェネリクス<WeatherData>でレスポンスデータの型を指定
                const response = await apiClient.get<WeatherData>('/forecast/city/130010');
                setWeather(response.data); // 天気情報をstateにセット
                console.log(weather);
                console.log(response.data);
            } catch (err) {
                // エラーが発生した場合、エラーメッセージをstateにセット
                setError((err as Error).message);
                console.log(err);
            }
        };

        fetchWeather(); // 天気情報を取得
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h1>天気予報アプリ</h1>
            {error ? (
                // エラーがある場合はエラーメッセージを表示
                <p style={{ color: 'red' }}>{error}</p>
            ) : weather ? (
                // 天気情報が取得できた場合はWeatherCardコンポーネントにデータを渡して表示
                <WeatherCard
                    city={weather.location.city}
                    weather={weather.forecasts[0].explanation}
                    temperature={{
                        max: weather.forecasts[0].temperature.max?.celsius || 'N/A', // maximum temperature
                        min: weather.forecasts[0].temperature.min?.celsius || 'N/A', // minimum temperature
                    }}
                    iconUrl={weather.forecasts[0].image.url} // Weather icon URL
                />
            ) : (
                // Loading message while retrieving data
                <p>天気情報を取得中...</p>
            )}
        </div>
    );
};

export default App;