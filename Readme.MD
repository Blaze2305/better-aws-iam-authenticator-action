# better-aws-iam-authenticator-action

Use this action to get and setup AWS IAM Authenticator

## Usage

```yaml

name: Test

on:
  push:
    branches:    
      - master

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: Blaze2305/better-aws-iam-authenticator-action@master
      with:
        # specify the version of aws iam authenticator you want eg 0.5.0, etc
        # if not specified it uses the latest version as default
        version: ""
    - run: aws-iam-authenticator version
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)