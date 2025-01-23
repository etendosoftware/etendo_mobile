import EANParser, { SMFEAN } from '../../src/ean128/index';
import { parse as parseDate } from 'date-fns';

describe('EANParser', () => {
  let parser: EANParser;
  const mockConfig = [
    {
      ai: '01',
      dataType: SMFEAN.EANDataTypes.String,
      contentLength: 14,
      isFixedLength: true,
      entity: 'product',
      entityField: 'id'
    },
    {
      ai: '10',
      dataType: SMFEAN.EANDataTypes.String,
      contentLength: 20,
      isFixedLength: false,
      isLot: true
    },
    {
      ai: '3102',
      dataType: SMFEAN.EANDataTypes.Decimal,
      contentLength: 6,
      isFixedLength: true
    },
    {
      ai: '11',
      dataType: SMFEAN.EANDataTypes.Date,
      contentLength: 6,
      isFixedLength: true,
      isGuaranteeDate: true
    }
  ];

  beforeEach(() => {
    parser = new EANParser(mockConfig);
  });

  describe('initialization', () => {
    it('should initialize with FNC character', () => {
      expect(parser.fncChar).toBe(String.fromCharCode(29));
    });

    it('should set config correctly', () => {
      expect(parser.config).toBe(mockConfig);
    });
  });

  describe('handleFormat', () => {
    it('should handle Integer type', () => {
      const result = parser.handleFormat('123', null, SMFEAN.EANDataTypes.Integer);
      expect(result).toBe(123);
    });

    it('should handle Decimal type with decimal AI', () => {
      const result = parser.handleFormat('1234', '2', SMFEAN.EANDataTypes.Decimal);
      expect(result).toBe('12.34');
    });

    it('should handle Decimal type without decimal AI', () => {
      const result = parser.handleFormat('1234', null, SMFEAN.EANDataTypes.Decimal);
      expect(result).toBe('1234');
    });

    it('should handle String type', () => {
      const result = parser.handleFormat('ABC123', null, SMFEAN.EANDataTypes.String);
      expect(result).toBe('ABC123');
    });

    it('should handle Date type', () => {
      const dateStr = '230415'; // 15-Apr-2023
      const result = parser.handleFormat(dateStr, null, SMFEAN.EANDataTypes.Date);
      expect(result).toEqual(parseDate(dateStr, SMFEAN.Constants.EAN_DATE_FORMAT, new Date()));
    });
  });

  describe('parse', () => {
    it('should return error when no config is provided', () => {
      parser.setConfig(null);
      const result = parser.parse('0123456789');
      expect(result).toEqual({
        error: true,
        errorMessage: 'No configuration was supplied'
      });
    });

    it('should parse fixed length AI correctly', () => {
      const ean = '0123456789';
      const result = parser.parse(ean);
      expect(result.AIs['01']).toBe('23456789');
      expect(result.product_id.value).toBe('23456789');
    });

    it('should parse variable length AI with FNC separator', () => {
      const fnc = String.fromCharCode(29);
      const ean = `10ABC123${fnc}0123456789`;
      const result = parser.parse(ean);
      expect(result.AIs['10']).toBe('ABC123');
      expect(result.lot.value).toBe('ABC123');
    });

    it('should parse decimal values correctly', () => {
      const ean = '3102123456';
      const result = parser.parse(ean);
      expect(result.AIs['3102']).toBe('123456');
    });

    it('should parse date values correctly', () => {
      const dateStr = '230415'; // 15-Apr-2023
      const ean = '11' + dateStr;
      const result = parser.parse(ean);
      expect(result.AIs['11']).toEqual(parseDate(dateStr, SMFEAN.Constants.EAN_DATE_FORMAT, new Date()));
      expect(result.guaranteedate.value).toEqual(parseDate(dateStr, SMFEAN.Constants.EAN_DATE_FORMAT, new Date()));
    });

    it('should handle multiple AIs in one barcode', () => {
      const fnc = String.fromCharCode(29);
      const ean = `10ABC123${fnc}3102123456`;
      const result = parser.parse(ean);
      
      expect(result.AIs['10']).toBe('ABC123');
      expect(result.AIs['3102']).toBe('123456');
      expect(result.lot.value).toBe('ABC123');
    });

    it('should handle whitespace in input', () => {
      const ean = ' 10ABC123 ';
      const result = parser.parse(ean);
      expect(result.AIs['10']).toBe('ABC123');
    });

    it('should handle long repeated sequences', () => {
      const malformedEan = '01'.repeat(SMFEAN.Constants.MAX_EAN_PARSE_LOOPS + 1);
      const result = parser.parse(malformedEan);
      expect(result.AIs).toBeDefined();
      expect(result.originalBarcode).toBe(malformedEan);
    });
  });
});
