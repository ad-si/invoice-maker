#import "invoice-maker.typ": *

#{ // add-zeros()
  assert.eq(add-zeros(1.234), "1.23")
  assert.eq(add-zeros(1.2), "1.20")
}

#{// mod-97()
  // "DE89370400440532013000" rearranged & expanded
  // → "370400440532013000131489", which mod 97 must equal 1.
  assert.eq(mod-97("370400440532013000131489"), 1)
}

#{// _bban-fmt-to-regex()
  assert.eq(_bban-fmt-to-regex("18n"), "^[0-9]{18}$")
  assert.eq(_bban-fmt-to-regex("4a14n"), "^[A-Z]{4}[0-9]{14}$")
  assert.eq(
    _bban-fmt-to-regex("10n11c2n"),
    "^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$",
  )
}

#{// verify-iban()
  let valid-ibans = (
    "DE89 3704 0044 0532 0130 00",
    "DE89370400440532013000",
    "de89370400440532013000", // lower-case accepted
    "DE44 5001 0517 5407 3249 31",
    "GB82 WEST 1234 5698 7654 32",
    "GB29 NWBK 6016 1331 9268 19",
    "GB17 BOFS 8005 5100 8137 96",
    "FR14 2004 1010 0505 0001 3M02 606",
    "CH93 0076 2011 6238 5295 7",
    "AT61 1904 3002 3457 3201",
    "BE68 5390 0754 7034",
    "ES91 2100 0418 4502 0005 1332",
  )

  for iban in valid-ibans {
    assert.eq(
      verify-iban(iban),
      true,
      message: "IBAN '" + iban + "' should be valid",
    )
  }

  let invalid-ibans = (
    "DE44 5001 0517 5407 3249 3X",        // letter where digit expected → bad checksum
    "DE89 3704 0044 0532 0130 01",        // last digit altered → bad checksum
    "DE91 2100 0418 4502 0005 1332",      // wrong length for DE
    "DE14 2004 1010 0505 0001 3M02 606",  // wrong length for DE
    "DE14 2004 1010 0505 0001 3M02 6067", // wrong length for DE
    "GB93 0076 2011 6238 5295",           // too short for GB
    "GB93 0076 2011 6238 5295 7",         // too short for GB
    "GB82 WEST 1234 5698 7654 322",       // too long for GB
    "1GB91 2100 0418 4502 0005 1332",     // doesn't start with country letters
    "XX89 3704 0044 0532 0130 00",        // unknown country code
    "DE89 3704 0044 0532 0130 0!",        // illegal character
    "DE89 ABCD 0044 0532 0130 00",        // letters where DE format expects digits
    "GB29 1234 6016 1331 9268 19",        // digits where GB format expects letters
    "NL91 1234 0417 1643 00",             // digits where NL bank code expects letters
  )

  for iban in invalid-ibans {
    assert.eq(
      verify-iban(iban),
      false,
      message: "IBAN '" + iban + "' should be invalid",
    )
  }

  // none / empty are accepted (no IBAN to validate)
  assert.eq(verify-iban(none), true)
  assert.eq(verify-iban(""), true)
}

#{//parse-date
  assert.eq(
    parse-date("2024-03-27"),
    datetime(year: 2024, month: 03, day: 27),
  )
}
