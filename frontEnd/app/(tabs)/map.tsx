import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import TabBar from '../../components/TabBar';
import Button from '../../components/Button'; // Импортируем компонент
import { GlobalStyles } from '../../constants/theme';

const MapScreen = () => {
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Карта питомцев</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
            body { 
                margin: 0; 
                padding: 0; 
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            }
            #map { 
                height: 100vh; 
                width: 100%; 
            }
            .pet-icon {
                background: transparent;
                border: none;
            }
            .leaflet-popup-content {
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                font-size: 14px;
            }
            .leaflet-popup-content-wrapper {
                border-radius: 12px;
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
            // Инициализация карты (Минск)
            var map = L.map('map').setView([53.9045, 27.5615], 12);
            
            // Альтернативные бесплатные тайловые серверы
            var cartoLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(map);
            
            // Резервный вариант тайлов
            var osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19
            });
            
            // Еще один резервный вариант
            var stadiaLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 20
            });

            // Маркеры питомцев в Минске
            var pets = [
                {
                    lat: 53.9045,
                    lng: 27.5615,
                    type: 'found',
                    animal: 'cat',
                    title: 'Найден кот',
                    description: 'Рыжий кот возле ЖД вокзала',
                    time: '2 часа назад'
                },
                {
                    lat: 53.9025, 
                    lng: 27.5618,
                    type: 'lost',
                    animal: 'dog',
                    title: 'Пропала собака',
                    description: 'Хаски, кобель, ошейник синий. Район Октябрьской',
                    time: '5 часов назад'
                },
                {
                    lat: 53.9090,
                    lng: 27.5750,
                    type: 'found', 
                    animal: 'cat',
                    title: 'Найдена кошка',
                    description: 'Черно-белая, пугливая, ищет хозяев. Улица Ленина',
                    time: 'вчера'
                },
                {
                    lat: 53.8990,
                    lng: 27.5550,
                    type: 'lost',
                    animal: 'dog',
                    title: 'Пропал щенок',
                    description: 'Такса, 4 месяца, очень дружелюбный. Район Купаловского',
                    time: '3 часа назад'
                },
                {
                    lat: 53.9070,
                    lng: 27.5450,
                    type: 'found',
                    animal: 'dog',
                    title: 'Найдена собака',
                    description: 'Дворняжка, рыжая, очень ласковая. Парк Горького',
                    time: '6 часов назад'
                },
                {
                    lat: 53.8950,
                    lng: 27.5700,
                    type: 'lost',
                    animal: 'cat',
                    title: 'Пропал кот',
                    description: 'Британский, серый. Район Троицкого предместья',
                    time: '1 день назад'
                }
            ];

            // Создаем иконки с эмодзи
            function createPetIcon(animal, type) {
                var emoji = animal === 'cat' ? '🐱' : '🐕';
                var color = type === 'found' ? '#4CAF50' : '#FF5252';
                
                return L.divIcon({
                    html: '<div style="background: ' + color + '; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">' + emoji + '</div>',
                    className: 'pet-icon',
                    iconSize: [40, 40],
                    iconAnchor: [20, 20]
                });
            }

            // Добавляем маркеры на карту и автоматически открываем первый попап
            pets.forEach(function(pet, index) {
                var icon = createPetIcon(pet.animal, pet.type);
                var marker = L.marker([pet.lat, pet.lng], {icon: icon})
                    .addTo(map)
                    .bindPopup(
                        '<div style="min-width: 200px;">' +
                        '<h3 style="margin: 0 0 8px 0; color: ' + (pet.type === 'found' ? '#4CAF50' : '#FF5252') + ';">' + pet.title + '</h3>' +
                        '<p style="margin: 0 0 8px 0;">' + pet.description + '</p>' +
                        '<small style="color: #666;">' + pet.time + '</small>' +
                        '</div>'
                    );
                
                // Автоматически открываем первый попап
                if (index === 0) {
                    setTimeout(function() {
                        marker.openPopup();
                    }, 1000);
                }
            });

            // Пытаемся определить местоположение пользователя
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        var userLat = position.coords.latitude;
                        var userLng = position.coords.longitude;
                        
                        // Добавляем маркер пользователя только если он в радиусе Беларуси
                        if (userLat > 51.0 && userLat < 57.0 && userLng > 23.0 && userLng < 33.0) {
                            L.marker([userLat, userLng], {
                                icon: L.divIcon({
                                    html: '<div style="background: #2196F3; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">📍</div>',
                                    className: 'user-icon',
                                    iconSize: [30, 30],
                                    iconAnchor: [15, 15]
                                })
                            })
                            .addTo(map)
                            .bindPopup("Ваше местоположение")
                            .openPopup();
                        }
                    },
                    function(error) {
                        console.log('Геолокация не доступна: ', error);
                    }
                );
            }

        </script>
    </body>
    </html>
  `;

  const renderMap = () => {
    if (Platform.OS === 'web') {
      return (
        <iframe 
          srcDoc={mapHtml}
          width="100%"
          height="100%"
          style={{ border: 0 }}
        />
      );
    }

    const WebView = require('react-native-webview').WebView;
    return (
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    );
  };

  const handleMapButtonPress = () => {
    console.log('Кнопка на карте нажата!');
    // Здесь можно добавить функционал
  };

  return (
    <View style={styles.safeArea}>
      <Header />
      <View style={styles.mapContainer}>
        {renderMap()}
        
        <Button 
          title="Узнать рекомендации недели"
          onPress={handleMapButtonPress}
          style={styles.mapButton}
        />
      </View>
      
      <TabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ECE1D1',   
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  mapButton: {
    position: 'absolute',
    bottom: 70, 
    right: 8,
  },
});

export default MapScreen;