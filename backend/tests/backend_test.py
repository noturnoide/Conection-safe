"""Backend tests for Canal de Escuta Anônima."""
import os
import re
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://report-channel.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"

PROTO_RE = re.compile(r"^ESC-[A-Z0-9]{4}-[A-Z0-9]{4}$")


@pytest.fixture(scope="module")
def payload():
    return {
        "tipo": "Cyberbullying",
        "localidade": "Sala 101",
        "vivencia": "Sofri",
        "tempo": "Esta semana",
        "detalhes": "TEST_ detalhes de teste automatizado",
        "denunciados": [
            {"cargo": "Aluno", "turma": "2B", "nome": "TEST_ Fulano"}
        ],
    }


def test_root():
    r = requests.get(f"{API}/")
    assert r.status_code == 200
    assert "message" in r.json()


def test_create_report(payload):
    r = requests.post(f"{API}/reports", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert PROTO_RE.match(data["protocolo"])
    assert data["tipo"] == payload["tipo"]
    assert data["denunciados"][0]["nome"] == "TEST_ Fulano"
    pytest.protocolo = data["protocolo"]


def test_create_report_optional_nome():
    p = {
        "tipo": "Assédio moral",
        "localidade": "Pátio",
        "vivencia": "Presenciei",
        "tempo": "Este mês",
        "detalhes": "TEST_ sem nome",
        "denunciados": [{"cargo": "Professor"}],
    }
    r = requests.post(f"{API}/reports", json=p)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["denunciados"][0].get("nome") is None
    assert data["denunciados"][0].get("turma") is None


def test_get_report_by_protocolo():
    proto = getattr(pytest, "protocolo", None)
    assert proto, "no protocol from prior test"
    r = requests.get(f"{API}/reports/{proto}")
    assert r.status_code == 200
    assert r.json()["protocolo"] == proto


def test_get_report_case_insensitive():
    proto = getattr(pytest, "protocolo", None)
    r = requests.get(f"{API}/reports/{proto.lower()}")
    assert r.status_code == 200


def test_get_report_not_found():
    r = requests.get(f"{API}/reports/ESC-XXXX-YYYY")
    assert r.status_code == 404


def test_list_reports():
    r = requests.get(f"{API}/reports")
    assert r.status_code == 200
    lst = r.json()
    assert isinstance(lst, list)
    assert any(x["protocolo"] == getattr(pytest, "protocolo", "") for x in lst)
