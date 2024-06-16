import { useState, useEffect } from 'react';
import vistor from './vistor.module.css';
import { useNavigate } from 'react-router-dom';
import Axios from "axios";

function Personpage() {
    const url = useNavigate();
    const [Lallselect, setLallselect] = useState(true);
    const [Eallselect, setEallselect] = useState(true);
    const [Aallselect, setAallselect] = useState(true);
    const [Dallselect, setDallselect] = useState(true);
    const [Gallselect, setGallselect] = useState(true);

    const [locationcheck, setlocationcheck] = useState([]);
    const [envcheck, setenvcheck] = useState("");
    const [areacheck, setareacheck] = useState([]);
    const [doorcheck, setdoorcheck] = useState([]);
    const [groupcheck, setgroupcheck] = useState([]);

    const [dblocation, setdblocation] = useState([]);
    const [dbenv, setdbenv] = useState([]);
    const [dbarea, setdbarea] = useState([]);
    const [dbdoor, setdbdoor] = useState([]);
    const [dbgroup, setdbgroup] = useState([]);

    useEffect(() => {
        Axios.get("http://localhost:8000/location").then((response) => {setdblocation(response.data)});
        Axios.get("http://localhost:8000/env").then((response) => {setdbenv(response.data)});
        Axios.get("http://localhost:8000/area").then((response) => {setdbarea(response.data)});
        Axios.get("http://localhost:8000/door").then((response) => {setdbdoor(response.data)});
        Axios.get("http://localhost:8000/group").then((response) => {setdbgroup(response.data)});
    },[])

    const Lallstate = (state) => {
        setLallselect(state);
        if(Lallselect === false){
            setlocationcheck([]);
        }else{
            setlocationcheck([...dblocation]);
        }
    }

    const Eallstate = (state) => {
        setEallselect(state);
        if(Eallselect === false){
            setenvcheck([]);
        }else{
            setenvcheck([...dbenv]);
        }
    }
    
    const Aallstate = (state) => {
        setAallselect(state);
        if(Aallselect === false){
            setareacheck([]);
        }else{
            setareacheck([...dbarea]);
        }
    }

    const Dallstate = (state) => {
        setDallselect(state);
        if(Dallselect === false){
            setdoorcheck([]);
        }else{
            setdoorcheck([...dbdoor]);
        }
    }

    const Gallstate = (state) => {
        setGallselect(state);
        if(Gallselect === false){
            setgroupcheck([]);
        }else{
            setgroupcheck([...dbgroup]);
        }
    }
    const locationstate = (item) => {
        if(locationcheck.includes(item)){
            setlocationcheck(locationcheck.filter((x) => x !== item));
        }else{
            setlocationcheck([...locationcheck, item])
        }
    }

    const envstate = (item) => {
        if(envcheck.includes(item)){
            setenvcheck(envcheck.filter((x) => x !== item));
        }else{
            setenvcheck([...envcheck, item])
        }
    }

    const areastate = (item) => {
        if(areacheck.includes(item)){
            setareacheck(areacheck.filter((x) => x !== item));
        }else{
            setareacheck([...areacheck, item])
        }
    }

    const doorstate = (item) => {
        if(doorcheck.includes(item)){
            setdoorcheck(doorcheck.filter((x) => x !== item));
        }else{
            setdoorcheck([...doorcheck, item])
        }
    }

    const groupstate = (item) => {
        if(groupcheck.includes(item)){
            setgroupcheck(groupcheck.filter((x) => x !== item));
        }else{
            setgroupcheck([...groupcheck, item])
        }
    }

    return (
        <body className={vistor.body}>
        <div className={vistor.backgroundfull}>
            <h5 className={vistor.h1}>你的期望</h5>
            <div className={vistor.wordbg}>
                <br/><br/><br/><br/>
                <h2 className={vistor.tilte}>記錄書</h2>
                <div className={vistor.Qspace}>
                    <h3 strong className={vistor.question}>地區:</h3>
                    &ensp;&ensp;
                    <div className={vistor.Aspace}>
                        <input type='checkbox' className={vistor.checkbox} onChange={() => {Lallstate(!Lallselect)}}></input>全部
                        &ensp;
                        {dblocation.map((location, index) => !["臺北市,新竹市 ", "臺北市,桃園市,金門縣", "臺北市,高雄市"].includes(location) &&(
                        <div key={index}>
                            <input type='checkbox' value={location} className={vistor.checkbox} onChange={(event) => {locationstate(event.target.value)}} checked={locationcheck.includes(location)}></input>{location}
                            &ensp;
                        </div>
                        ))}
                    </div>
                </div>
                <br/>
                <div className={vistor.Qspace}>
                    <h3 strong className={vistor.question}>環境:</h3>
                    &ensp;&ensp;
                    <div className={vistor.Aspace}>
                        <input type='checkbox' className={vistor.checkbox} onChange={() => {Eallstate(!Eallselect)}}></input>全部
                        &ensp;
                        {dbenv.map((env, index) => (
                        <div key={index}>
                            <input type='checkbox' value={env} className={vistor.checkbox} onChange={(event) => {envstate(event.target.value)}} checked={envcheck.includes(env)}></input>{env}
                            &ensp;
                        </div>
                        ))}
                    </div>
                </div>
                <br/>
                <div className={vistor.Qspace}>
                    <h3 strong className={vistor.question}>領域:</h3>
                    &ensp;&ensp;
                    <div className={vistor.Aspace}>
                        <input type='checkbox' className={vistor.checkbox} onChange={() => {Aallstate(!Aallselect)}}></input>全部
                        &ensp;
                        {dbarea.map((area, index) => (
                        <div key={index}>
                            <input type='checkbox' value={area} className={vistor.checkbox} onChange={(event) => {areastate(event.target.value)}} checked={areacheck.includes(area)}></input>{area}
                            &ensp;
                        </div>
                        ))}
                    </div>
                </div>
                <br/>
                <div className={vistor.Qspace}>
                    <h3 strong className={vistor.question}>學門:</h3>
                    &ensp;&ensp;
                    <div className={vistor.Aspace}>
                        <input type='checkbox' className={vistor.checkbox} onChange={() => {Dallstate(!Dallselect)}}></input>全部
                        &ensp;
                        {dbdoor.map((door, index) => (
                        <div key={index}>
                            <input type='checkbox' value={door} className={vistor.checkbox} onChange={(event) => {doorstate(event.target.value)}} checked={doorcheck.includes(door)}></input>{door}
                            &ensp;
                        </div>
                        ))}
                    </div>
                </div>
                <br/>
                <div className={vistor.Qspace}>
                    <h3 strong className={vistor.question}>學類:</h3>
                    &ensp;&ensp;
                    <div className={vistor.Aspace}>
                        <input type='checkbox' className={vistor.checkbox} onChange={() => {Gallstate(!Gallselect)}}></input>全部
                        &ensp;
                        {dbgroup.map((group, index) => (
                        <div key={index}>
                            <input type='checkbox' value={group} className={vistor.checkbox} onChange={(event) => {groupstate(event.target.value)}} checked={groupcheck.includes(group)}></input>{group}
                            &ensp;
                        </div>
                        ))}
                    </div>
                </div>
                <div className={vistor.btnspace}>
                    <button className={vistor.btn} onClick={() => {url("./game1")}}>冒險開始</button>
                </div>
            </div>
        </div>
    </body>
    );
}

export default Personpage;