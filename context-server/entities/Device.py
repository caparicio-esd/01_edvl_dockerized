import threading

class Device:
    name: str = None
    debug: bool = False

    timer: threading.Timer = None
    timerSeconds: int = 1
    timerIsRunning: bool = False

    def _create_device(self) -> None:
        raise NotImplementedError

    def _update_device(self)-> None:
        raise NotImplementedError

    def _run(self) -> None:
        """
        Run device updates
        """
        if self.timerIsRunning: self.timer.cancel()
        self.timer = threading.Timer(self.timerSeconds, self._update_device)
        self.timer.start()
        self.timerIsRunning = True

    def orion_format(self) -> dict:
        raise NotImplementedError