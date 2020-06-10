import React, { Component, useState, useEffect } from 'react';
import { DateTime } from "luxon";
import _ from 'lodash/core';
import './Home.css';
import Loading from '../common/Loading';
var api = require('../util/api');

const Highscore = ({ currentHighScore }) => {
    if (typeof(currentHighScore) !== "number") {
        return null;
    }

    return (
        <div className="score-container">
            <p className="score-title">Current High Score: <span className="score-result">{currentHighScore} days</span></p>
        </div>
    );
}

const Sev1Dashboard = ({ currentHighScore, daysSinceSev, status, ticketCreatedAt, ticketTitle, ticketSummary, investigativeSteps, resolutionSummary }) => {
    let cardClassList = ['card'];
    let statusClass = status === 'solved' ? 'statusSuccess' : 'statusError';
    let sev1Datetime = DateTime.fromISO(ticketCreatedAt);

    if (daysSinceSev < 1) {
        cardClassList.push('severity-critical');
    }

    return (
        <div>
            <h1 className={cardClassList.join(' ')}>
                {daysSinceSev}
            </h1>
            <div className='metaData'>
                <h2 className={statusClass}>
                    <strong>Status</strong>: {status}
                </h2>
                <h2>
                    {sev1Datetime.toLocaleString(DateTime.DATETIME_MED)}&nbsp;&nbsp;-&nbsp;&nbsp;<b>{ticketTitle}</b>
                </h2>
                <p>
                    <strong>Summary</strong>: {ticketSummary}
                </p>
                <p>
                    <strong>Investigative Steps</strong>: {investigativeSteps}
                </p>
                <p>
                    <strong>Resolution</strong>: {resolutionSummary}
                </p>
            </div>
            <Highscore {...currentHighScore} />
        </div>
    );
}

const HomeController = () => {
    const [daysSinceSev1, setDaysSinceSev1] = useState(null);

    const getSev1Data = () => {
        api.getJsonAsync('api/NewRelic/DaysSinceSev?severity=1')
            .then(data => {
                if (!daysSinceSev1 && !_.isEqual(daysSinceSev1, data)) {
                    setDaysSinceSev1(data);
                }
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        if (daysSinceSev1 === null) {
            getSev1Data();
        }

        const interval = setInterval(() => {
            getSev1Data()
        }, 10 * 60 * 1000); // 10min interval
        return () => clearInterval(interval);
    });

    return (
        daysSinceSev1 === null ? 
            <Loading />
            : <Sev1Dashboard {...daysSinceSev1} />
    )
}

export default class Home extends Component {
    displayName = Home.name

    render() {
        return (
          <div>
            <h1>Days Since Sev 1</h1>
                <HomeController {...this.props} />
          </div>
        )
    }
}
