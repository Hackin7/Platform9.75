###Unused for now
import logging
import boto3
from botocore.exceptions import ClientError


def get_object_acl(bucket_name, object_name):
    s3 = boto3.client('s3')
    with open(object_name,'wb') as f:
        s3.download_fileobj(bucket_name, object_name, f)

def put_object(bucket_name, file_name):
    s3 = boto3.client('s3')
    try:
        response = s3.upload_file(file_name, bucket_name, file_name)
    except ClientError as e:
        # AllAccessDisabled error == bucket not found
        logging.error(e)
        return None

    return response
