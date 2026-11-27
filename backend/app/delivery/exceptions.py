class DeliveryNotConfiguredError(Exception):
    """Расчёт доставки выключен."""


class InvalidShipmentError(Exception):
    """Посылку нельзя рассчитать."""


class CarrierUnavailableError(Exception):
    """СДЭК временно недоступен."""
