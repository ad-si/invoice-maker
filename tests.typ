#import "invoice-maker.typ": *

#{ // add-zeros()
  assert.eq(add-zeros(1.234), "1.23")
  assert.eq(add-zeros(1.2), "1.20")
}

#{// verify-iban()
  let iban-tests = (
      ("DE", "DE44 5001 0517 5407 3249 31", true),
      ("DE", "DE89 3704 0044 0532 0130 00", true),

      ("DE", "DE44 5001 0517 5407 3249 3X", false),
      ("DE", "DE91 2100 0418 4502 0005 1332", false),
      ("DE", "DE14 2004 1010 0505 0001 3M02 606", false),
      ("DE", "DE14 2004 1010 0505 0001 3M02 6067", false),

      ("GB", "GB82 WEST 1234 5698 7654 32", true),
      ("GB", "GB29 NWBK 6016 1331 9268 19", true),

      ("GB", "GB93 0076 2011 6238 5295", false),
      ("GB", "GB93 0076 2011 6238 5295 7", false),
      ("GB", "GB82 WEST 1234 5698 7654 322", false), // 1 char too long
      ("GB", "1GB91 2100 0418 4502 0005 1332", false),
    )

  for (country, iban, expected-result) in iban-tests {
    assert.eq(
      verify-iban(country, iban),
      expected-result,
      message: "IBAN '" + iban + "' should be "
        + if expected-result { "valid" } else { "invalid" }
        + " for " + country
    )
  }
}
