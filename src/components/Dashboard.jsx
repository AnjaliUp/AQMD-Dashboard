import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "./Chart";
import "../styles.css";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const fields = [
    { title: "PM2.5", fieldIndex: 1, color: "red" },
    { title: "PM10", fieldIndex: 2, color: "blue" },
    { title: "Ozone", fieldIndex: 3, color: "green" },
    { title: "Humidity", fieldIndex: 4, color: "orange" },
    { title: "Temperature", fieldIndex: 5, color: "purple" },
    { title: "CO", fieldIndex: 6, color: "gray" },
  ];

  // Generate time slots for the last 10 hours
  const generateTimeSlots = () => {
    const currentTime = new Date();
    const startMinutes = currentTime.getMinutes();
    return Array.from({ length: 10 }, (_, i) => {
      const time = new Date(currentTime);
      time.setHours(time.getHours() - i, startMinutes, 0, 0);
      return time;
    }).reverse();
  };

  const [timeSlots, setTimeSlots] = useState(generateTimeSlots());

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://api.thingspeak.com/channels/1596152/feeds.json?results=50"
      );
      const feeds = response.data.feeds;

      const mappedData = timeSlots.map((slot) => {
        const matchingEntry = feeds.find((entry) => {
          const entryTime = new Date(entry.created_at);
          return (
            entryTime.getHours() === slot.getHours() &&
            entryTime.getDate() === slot.getDate() &&
            entryTime.getMonth() === slot.getMonth() &&
            entryTime.getFullYear() === slot.getFullYear()
          );
        });

        return {
          time: slot,
          fields: fields.map((_, index) =>
            matchingEntry ? matchingEntry[`field${index + 1}`] : null
          ),
        };
      });

      setData(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      setTimeSlots(generateTimeSlots());
      fetchData();
    }, 3600000); // Reload every hour
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <h1>Air Quality Monitoring Dashboard</h1>
      <div className="charts-container">
        {fields.map((field, index) => (
          <div key={index} className="graph-box">
            <Chart
              title={field.title}
              data={data.map((entry) => ({
                time: entry.time.toLocaleString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                value: entry.fields[index] || 0,
              }))}
              color={field.color}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
