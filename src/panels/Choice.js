import React, { useRef, useEffect, useState, useCallback } from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Banner from '@vkontakte/vkui/dist/components/Banner/Banner';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Textarea from '@vkontakte/vkui/dist/components/Textarea/Textarea';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import bridge from '@vkontakte/vk-bridge';
import place from './place.png';
import './Choice.css';
import send from '../net';

const Choiсe = ({ id, fetchedUser, createOrder }) => {
    const mapContainer = useRef(null);
    const [addr, setAddr] = useState('');
    const [lastStage, setStage] = useState(false);
    const [tekGeo, setTek] = useState(null);
    const [sendGeo, setSend] = useState(null);
    const [comment, setComment] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [mapSt, setMap] = useState(null);

    mapboxgl.accessToken = 'pk.eyJ1IjoibG9yZGRlc2VjcmF0b3IiLCJhIjoiY2toZ2hraGVrMDd5eDJ0bzFraG9meDY3NyJ9.2yax9LYlpPdMQiRHp-1njg';

    const geocode = (lng, lat) => {
        const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
            + lng + ', ' + lat
            + '.json?access_token=' + mapboxgl.accessToken; 
        fetch(url).then((json) => {
            json.json().then((data) => {
                setAddr(data.features[0].place_name);
                setTek({
                    lon: lng,
                    lat: lat
                });
            });
        });
    }

    const setCoord = useCallback((e) => {
        const coords = e.lngLat;
        geocode(coords.lng, coords.lat);
    });

    const coordWrap = (e) => {
        setCoord(e);
    }

    useEffect(() => {
       // if(!lastStage) {
            (async () => {
                let lat = 56.74;
                let lon = 37.17;
                try { 
                    const geo = await bridge.send("VKWebAppGetGeodata");
                    if(geo.available) {
                        lat = geo.lat;
                        lon = geo.long;
                    }
                } catch(e) {

                }
                const map = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: [lon, lat],
                    zoom: 12.5
                });
                map.on('mouseup', coordWrap);
                setMap(map);
                geocode(lon, lat);
                return () => map.remove();
            })();
       // }
    }, []);

    const checkBut = (lng, lat) => {
        if(true) {
            const apply = {
                sendLat: tekGeo.lat, 
                sendLon: tekGeo.lon,
                recvLat: lat,
                recvLon: lng,
            };
            console.log(apply);
            send('api/available/check', 'POST', apply, (json) => {
                console.log(json);
                if(json.available) {
                    setDisabled(false);
                } else {
                    setDisabled(true);
                }
            });
        }
    }

    const choiceSend = () => {
        setSend(tekGeo);
        setStage(true);
        
        mapSt.on('mouseup', (e) => {
            const coords = e.lngLat;
            checkBut(coords.lng, coords.lat);
        });
    }

    const choiceRecv = () => {
        createOrder(fetchedUser.id, sendGeo, tekGeo, comment);
    }

    return (
        <Panel id={id}>
		    <PanelHeader>Заказ доставки</PanelHeader>
            <Group title="Header">
                {fetchedUser &&
                <Cell
                    before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
                    description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
                >
                    {`${fetchedUser.first_name} ${fetchedUser.last_name}`}
                </Cell>
                }
            </Group>
            <Group title="Map">
                <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.45.0/mapbox-gl.css' rel='stylesheet' />
                <div ref={mapContainer} className="map-container">
                    <img src={place} className="place" width={50} height={50} alt="place" />
                </div>
                <div className="place-container">
                    
                </div>
                <Div>
                    <Banner header={addr} subheader={lastStage ? "Адрес получателя" : "Ваш адрес"}/>
                    {lastStage && <Div>
                        <Textarea placeholder="Комментарий" value={comment} onChange={(event) => setComment(event.target.value)} />
                    </Div> }
                    <Div style={{display: 'flex'}} onClick={() => {lastStage ? choiceRecv() : choiceSend()}}>
                        <Button size="l" stretched disabled={disabled && lastStage}>Продолжить</Button>
                    </Div>
                </Div>
            </Group>
        </Panel>
    )
} 

export default Choiсe;