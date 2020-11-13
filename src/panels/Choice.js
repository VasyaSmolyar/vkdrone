import React, { useRef, useEffect } from 'react';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
//import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import './Choice.css';

const Choiсe = ({ id, fetchedUser }) => {
    const mapContainer = useRef(null);
    mapboxgl.accessToken = 'pk.eyJ1IjoibG9yZGRlc2VjcmF0b3IiLCJhIjoiY2toZ2hraGVrMDd5eDJ0bzFraG9meDY3NyJ9.2yax9LYlpPdMQiRHp-1njg';

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11'
        });
        return () => map.remove();
    }, []);

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
                <div className="sheet">
                    <div ref={mapContainer} className="map-container">
                    </div>
                </div>
            </Group>
        </Panel>
    )
} 

export default Choiсe;