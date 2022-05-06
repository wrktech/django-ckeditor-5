import urllib.parse
from pathlib import Path
from django.core.files.storage import default_storage

from django import get_version
from django.http import Http404
from django.utils.module_loading import import_string

if get_version() >= "4.0":
    from django.utils.translation import gettext_lazy as _
else:
    from django.utils.translation import ugettext_lazy as _
from django.http import JsonResponse
from django.conf import settings
from .forms import UploadFileForm
from PIL import Image


class NoImageException(Exception):
    pass


def get_storage_class():
    if hasattr(settings, "CKEDITOR5_FILE_STORAGE"):
        return import_string(settings.CKEDITOR5_FILE_STORAGE)
    return import_string(settings.DEFAULT_FILE_STORAGE)


storage = get_storage_class()


def image_verify(f):
    try:
        Image.open(f).verify()
    except IOError:
        raise NoImageException


def handle_uploaded_file(f):
    folder = getattr(settings, "CKEDITOR_5_UPLOADS_FOLDER", "django_ckeditor_5")
    uploads_path = Path(settings.MEDIA_ROOT, folder)
    client = storage.Client()
    bucket = client.get_bucket("test-nyama")
    new_blob = bucket.blob('test_file.jpeg')
    default_storage.save('/test_gile.jpeg', new_blob)
    gcs_url = 'https://test-nyama.storage.googleapis.com/test_file.jpeg'
    return gcs_url


def upload_file(request):
    if request.method == "POST" and request.user.is_staff:
        form = UploadFileForm(request.POST, request.FILES)
        try:
            image_verify(request.FILES["upload"])
        except NoImageException as ex:
            return JsonResponse({"error": {"message": "{}".format(str(ex))}})
        if form.is_valid():
            url = handle_uploaded_file(request.FILES["upload"])
            return JsonResponse({"url": url})
    raise Http404(_("Page not found."))
