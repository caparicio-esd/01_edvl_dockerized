import threading
from typing import List, Tuple
from datetime import datetime
from .constants import DEBUG
from .OrionConnector import OrionConnector
from .Device import Device
import requests


# https://api.wheretheiss.at/v1/satellites/25544
class Satellite(Device):
    """
    Reading position from ISS and pushing to Fiware Orion 
    """
    name: str = None
    debug: bool = False
    timer: threading.Timer = None
    timerSeconds: int = 3
    timerIsRunning: bool = False
    ISS_API_ENDPOINT = "https://api.wheretheiss.at/v1/satellites/25544"

    geoPosition: List[float] = [0., 0.]
    altitude: float = 0.
    velocity: float = 0.

    def __init__(self, name, debug=False) -> None:
        """
        Init Class
        """
        self.debug = debug
        self.name = name
        self._create_device()
        self._run()

    def _create_device(self) -> None:
        OrionConnector.createEntity(self.orion_format())

    def _run(self) -> None:
        if self.timerIsRunning:
            self.timer.cancel()
        self.timer = threading.Timer(self.timerSeconds, self._update_device)
        self.timer.start()
        self.timerIsRunning = True

    def _update_device(self, first_run=False) -> None:
        try:
            r = requests.get(self.ISS_API_ENDPOINT)
            r_body = r.json()
            self.geoPosition = [r_body["latitude"], r_body["longitude"]]
            self.altitude = r_body["altitude"]
            self.velocity = r_body["velocity"]
            OrionConnector.updateEntity(
                self.orion_format(), ["altitude", "velocity", "updated", "location"])
            if (self.debug or DEBUG):
                print(self)
            self._run()
        except Exception as e:
            print(e.__cause__)

    def orion_format(self) -> dict:
        """
        Orion representation of Satelite
        """
        return {
            "id": "urn:ngsi-ld:{}:{}".format(self.__class__.__name__, self.name),
            "type": self.__class__.__name__,
            "name": {
                "type": "Name",
                "value": self.name
            },
            "altitude": {
                "type": "Number",
                "value": self.altitude
            },
            "velocity": {
                "type": "Number",
                "value": self.velocity
            },
            "location": {
                "type": "geo:point",
                "value": "{}, {}".format(self.geoPosition[0], self.geoPosition[1])
            },
            "updated": {
                "type": "DateTime",
                "value": datetime.now().isoformat()
            }
        }

    def __str__(self) -> str:
        """
        Debugging representation of Sensor
        """
        return "\n\
            Sensor {}\n\
                Geolocation: {},\n\
                Velocity: {},\n\
                Altitude: {},\n\
                Time: {}\n\
        ".format(
            self.name,
            "{}, {}".format(self.geoPosition[0], self.geoPosition[1]),
            self.altitude,
            self.velocity,
            datetime.now().isoformat()
        ).lstrip()
