const MOCK_DB = {
  USER: {
    name: "วิศวกร ชลประทาน",
    position: "วิศวกรชลประทานปฏิบัติการ",
    agency: "สำนักงานทรัพยากรน้ำแห่งชาติ",
    division: "ศูนย์อำนวยการน้ำแห่งชาติ",
    group: "กลุ่มสารสนเทศทรัพยากรน้ำ",
    avatar:
      "https://ui-avatars.com/api/?name=User+Thai&background=0D8ABC&color=fff",
  },
  CATALOG: [
    {
      id: 1,
      title: "ข้อมูลการใช้ประโยชน์ที่ดิน (Land Use)",
      type: "Shapefile",
      typeColor: "orange",
      icon: "fa-map-location-dot",
      iconColor: "blue",
      bg: "blue-50",
      year: "ปีงบประมาณ 2567",
      scale: "มาตราส่วน 1:4000",
      description:
        "ข้อมูลแผนที่แสดงการจำแนกประเภทการใช้ประโยชน์ที่ดิน ครอบคลุมพื้นที่ลุ่มน้ำเจ้าพระยา",
      coords: [13.7563, 100.5018], // Bangkok
      tags: ["ผังเมือง", "การใช้ที่ดิน", "ผังสี", "LJZ"],
      metadata: {
        owner: "กรมพัฒนาที่ดิน",
        frequency: "รายปี",
        license: "Open Government License",
        language: "ไทย (TH)",
        coverage: "ลุ่มน้ำเจ้าพระยา",
        source: "สำรวจภาคสนามและภาพถ่ายดาวเทียม",
        contact: "support@ldd.go.th",
        last_updated: "1 ต.ค. 2566"
      },
      sample_data: {
        columns: ["LU_ID", "LU_CODE", "LU_NAME", "AREA_SQM", "PROVINCE", "AMPHOE", "TAMBON", "SURVEY_DATE", "SURVEYOR", "REMARK"],
        rows: [
            ["1001", "A01", "นาข้าว (Paddy Field)", "12500.50", "ปทุมธานี", "คลองหลวง", "คลองหนึ่ง", "2023-05-10", "นายสมชาย ใจดี", "-"],
            ["1002", "U04", "หมู่บ้านจัดสรร", "8400.00", "ปทุมธานี", "คลองหลวง", "คลองหนึ่ง", "2023-05-11", "นายสมชาย ใจดี", "-"],
            ["1003", "F02", "ป่าเบญจพรรณ", "56000.75", "ปทุมธานี", "หนองเสือ", "บึงบอน", "2023-05-12", "นางสาววิไล", "พื้นที่อนุรักษ์"],
            ["1004", "W01", "แม่น้ำ/ลำคลอง", "45000.00", "อยุธยา", "บางปะอิน", "บ้านเลน", "2023-05-15", "ทีมสำรวจที่ 2", "-"],
            ["1005", "A02", "พืชไร่ผสม", "3200.25", "อยุธยา", "วังน้อย", "ลำตาเสา", "2023-05-16", "ทีมสำรวจที่ 2", "รอตรวจสอบซ้ำ"]
        ]
      }
    },
    {
      id: 2,
      title: "ปริมาณน้ำฝนรายวัน (Daily Rainfall)",
      type: "CSV / Excel",
      typeColor: "green",
      icon: "fa-file-csv",
      iconColor: "green",
      bg: "green-50",
      year: "2566 - ปัจจุบัน",
      scale: "-",
      description: "ข้อมูลปริมาณน้ำฝนรายวันจากสถานีตรวจวัดทั่วประเทศ",
      coords: [18.78, 98.98], // Chiang Mai
      tags: ["น้ำฝน", "สภาพอากาศ", "TMD"],
      metadata: { 
          owner: "กรมอุตุนิยมวิทยา",
          frequency: "รายวัน (24 ชม.)",
          license: "Creative Commons Attributions",
          language: "อังกฤษ (EN)"
      },
      uploader: "Staff 1"
    },
    {
      id: 3,
      title: "ระดับน้ำในเขื่อน (Real-time)",
      type: "API Service",
      typeColor: "purple",
      icon: "fa-cloud-arrow-down",
      iconColor: "purple",
      bg: "purple-50",
      year: "Update ทุก 15 นาที",
      scale: "-",
      description:
        "API สำหรับเชื่อมต่อข้อมูลระดับน้ำและปริมาณน้ำกักเก็บในเขื่อนหลัก",
      coords: [17.88, 98.62], // Bhumibol Dam
      tags: ["เขื่อน", "ปริมาณน้ำ", "Real-time", "EGAT"],
      metadata: { owner: "การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย (กฟผ.)" },
      uploader: "Staff 2"
    },
    {
      id: 4,
      title: "ชั้นข้อมูลดิน (Soil Series)",
      type: "Shapefile",
      typeColor: "orange",
      icon: "fa-layer-group",
      iconColor: "blue",
      bg: "blue-50",
      year: "ความละเอียดสูง",
      scale: "กรมพัฒนาที่ดิน",
      description:
        "ชุดดินและสมบัติของดินเพื่อการเกษตรกรรม พร้อมคำแนะนำการใช้ปุ๋ย",
      coords: [16.44, 102.82], // Khon Kaen
      tags: ["ดิน", "การเกษตร", "ทรัพยากรดิน", "LDD"],
      metadata: { owner: "กรมพัฒนาที่ดิน" },
      uploader: "Administrator"
    },
    {
      id: 5,
      title: "พื้นที่เสี่ยงอุทกภัย (Flood Risk Area)",
      type: "Shapefile",
      typeColor: "orange",
      icon: "fa-house-flood-water",
      iconColor: "red",
      bg: "red-50",
      year: "ปี 2566",
      scale: "1:50000",
      description: "พื้นที่เสี่ยงอุทกภัยซ้ำซาก และพื้นที่เฝ้าระวังพิเศษ",
      coords: [15.22, 104.85], // Ubon
      tags: ["น้ำท่วม", "ภัยพิบัติ", "ความเสี่ยง", "GISTDA"],
      metadata: { owner: "GISTDA" },
      uploader: "Staff 1"
    },
    {
      id: 6,
      title: "เส้นทางน้ำ (Water Way)",
      type: "Shapefile",
      typeColor: "orange",
      icon: "fa-water",
      iconColor: "cyan",
      bg: "cyan-50",
      year: "2567 Update",
      scale: "1:4000",
      description: "ข้อมูลเส้นทางน้ำสายหลักและสายรอง ทั่วประเทศ",
      coords: [13.43, 99.95], // Samut Songkhram
      metadata: { owner: "กรมทรัพยากรน้ำ", last_updated: "2024-01-15" },
      metadata: { owner: "กรมทรัพยากรน้ำ", last_updated: "2024-01-15" },
      uploader: "Administrator"
    },
  ],
  DATA_REQUESTS: [
      {
          id: 1,
          userId: 4,
          userName: "วิศวกร ชลประทาน",
          topic: "ขอข้อมูลปริมาณน้ำฝนรายรายอำเภอ ย้อนหลัง 10 ปี",
          type: "เพื่อการวิจัย / การศึกษา",
          details: "ต้องการข้อมูลเพื่อนำไปวิเคราะห์แนวโน้มภัยแล้งในพื้นที่ภาคอีสาน เพื่อประกอบงานวิทยานิพนธ์",
          date: "2024-01-15",
          status: "pending",
          assignee_id: 2
      },
      {
          id: 2,
          userId: 3,
          userName: "เจ้าหน้าที่ 2",
          topic: "ขอ Shapefile พื้นที่เสี่ยงภัยจำแนกตามหมู่บ้าน",
          type: "เพื่อการปฏิบัติงาน",
          details: "ใช้สำหรับการวางแผนลงพื้นที่สำรวจและช่วยเหลือผู้ประสบภัย",
          date: "2024-01-18",
          status: "approved",
          assignee_id: 3
      },
      {
          id: 3,
          userId: 101,
          userName: "ประชาชนทั่วไป",
          topic: "ขอข้อมูลระดับน้ำในแม่น้ำเจ้าพระยา",
          type: "ความสนใจส่วนตัว",
          details: "ติดตามสถานการณ์น้ำดูหน้าบ้าน",
          date: "2024-01-19",
          status: "rejected",
          assignee_id: 2
      }
  ],
  HISTORY: [
    {
      id: "REQ-2566-0089",
      date: "10 ม.ค. 2567",
      status: "ready", // ready, processing, pending
      statusLabel: "พร้อมดาวน์โหลด",
      items: ["ข้อมูลการใช้ประโยชน์ที่ดิน", "สถิติน้ำฝนรายวัน"],
      reason: "เพื่อการวางแผนโครงการภาครัฐ",
    },
    {
      id: "REQ-2566-0085",
      date: "05 ม.ค. 2567",
      status: "processing",
      statusLabel: "กำลังดำเนินการ",
      items: ["ระดับน้ำในเขื่อน"],
      reason: "เพื่อการศึกษา / วิจัย",
    },
    {
      id: "REQ-2566-0012",
      date: "12 ธ.ค. 2566",
      status: "completed",
      statusLabel: "ดาวน์โหลดแล้ว",
      items: ["แผนที่ภาพถ่ายทางอากาศ"],
      reason: "เพื่อประกอบธุรกิจ",
      timeline: [
        { status: "submitted", date: "10 ธ.ค. 66", desc: "ยื่นคำขอเรียบร้อย" },
        { status: "approved", date: "11 ธ.ค. 66", desc: "อนุมัติคำขอ" },
        { status: "processing", date: "11 ธ.ค. 66", desc: "กำลังรวบรวมข้อมูล" },
        { status: "completed", date: "12 ธ.ค. 66", desc: "ดำเนินการเสร็จสิ้น" }
      ]
    },
  ],
  KPI_STATS: {
      total_requests: 1240,
      completed_requests: 1180,
      pending_requests: 60,
      user_satisfaction: 4.8,
      monthly_trend: [65, 59, 80, 81, 56, 95, 110, 120, 135, 140, 125, 140], // Mock monthly data
      top_datasets: [
          { name: "ข้อมูลการใช้ประโยชน์ที่ดิน", count: 450 },
          { name: "สถิติน้ำฝนรายวัน", count: 320 },
          { name: "พื้นที่เสี่ยงอุทกภัย", count: 210 },
          { name: "ระดับน้ำในเขื่อน", count: 150 },
          { name: "เส้นทางน้ำ", count: 110 }
      ],
      sla_met: 95, // percent
      governance_score: 85, // New: Data Governance Score
      data_quality: { // New: Data Quality Metrics
          completeness: 92,
          accuracy: 88,
          timeliness: 95,
          consistency: 90
      },
      open_data_ranking: 4, // New: Ranking among departments
      top_agencies: [ // New: Top requesting agencies
          { name: "กรมชลประทาน", count: 320 },
          { name: "กรมทรัพยากรน้ำ", count: 210 },
          { name: "อบจ. นนทบุรี", count: 150 },
          { name: "มหาวิทยาลัยเกษตรศาสตร์", count: 120 }
      ]
  },
  GIS_LAYERS: {
        BOUNDARIES: [
            { id: 'province', name: 'ขอบเขตจังหวัด', type: 'polygon', color: '#3388ff' },
            { id: 'district', name: 'ขอบเขตอำเภอ', type: 'polygon', color: '#ff3388' },
            { id: 'subdistrict', name: 'ขอบเขตตำบล', type: 'polygon', color: '#33ff88' }
        ],
        BASINS: [
            { id: 'main_basin', name: 'ขอบเขตลุ่มน้ำหลัก', type: 'polygon', color: '#004c99' },
            { id: 'sub_basin', name: 'ขอบเขตลุ่มน้ำย่อย', type: 'polygon', color: '#66b2ff' }
        ],
        WATER_WAYS: [
            { id: 'main_river', name: 'เส้นลำน้ำหลัก', type: 'polyline', color: '#0066cc', weight: 4 },
            { id: 'sub_river', name: 'เส้นลำน้ำรอง', type: 'polyline', color: '#4da6ff', weight: 2 }
        ],
        WATER_SOURCES: [
            { id: 'large_water', name: 'แหล่งน้ำขนาดใหญ่', type: 'circle', color: '#000080', radius: 10000 },
            { id: 'medium_water', name: 'แหล่งน้ำขนาดกลาง', type: 'circle', color: '#0000cd', radius: 5000 },
            { id: 'small_water', name: 'แหล่งน้ำขนาดเล็ก', type: 'circle', color: '#1e90ff', radius: 2000 }
        ],
        STATIONS: [
            { id: 'rain_station', name: 'สถานีวัดน้ำฝน', type: 'marker', icon: 'fa-cloud-rain', color: 'blue' },
            { id: 'water_station', name: 'สถานีวัดน้ำท่า', type: 'marker', icon: 'fa-water', color: 'green' }
        ],
        DISASTERS: [
            { id: 'flood_area', name: 'พื้นที่น้ำท่วม (ตามปีระบุ)', type: 'polygon', color: '#ff4d4d' },
            { id: 'repeat_flood', name: 'พื้นที่น้ำท่วม/แล้ง ซ้ำซาก', type: 'polygon', color: '#ff9933' }
        ],
        LAND_USE: [
            { id: 'landuse_1', name: 'การใช้ประโยชน์ที่ดิน ระดับ 1', type: 'polygon', color: '#228b22' },
            { id: 'landuse_2', name: 'การใช้ประโยชน์ที่ดิน ระดับ 2', type: 'polygon', color: '#32cd32' },
            { id: 'landuse_3', name: 'การใช้ประโยชน์ที่ดิน ระดับ 3', type: 'polygon', color: '#90ee90' }
        ],
        INFRASTRUCTURE: [
            { id: 'road', name: 'ถนน', type: 'polyline', color: '#696969', weight: 2 }
        ]
    },
    GEOJSON: {
        province: {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": { "name": "กรุงเทพมหานคร" },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[
                            [100.329, 13.508], [100.355, 13.627], [100.413, 13.687], [100.395, 13.780], 
                            [100.437, 13.824], [100.518, 13.904], [100.627, 13.953], [100.697, 13.921],
                            [100.741, 13.844], [100.865, 13.870], [100.929, 13.834], [100.912, 13.693],
                            [100.835, 13.627], [100.746, 13.567], [100.584, 13.518], [100.456, 13.491],
                            [100.329, 13.508]
                        ]]
                    }
                },
                {
                    "type": "Feature",
                    "properties": { "name": "นนทบุรี", "color": "#ffaa00" },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[
                             [100.347, 13.791], [100.312, 13.916], [100.375, 14.009], [100.473, 14.072],
                             [100.551, 13.924], [100.518, 13.904], [100.437, 13.824], [100.395, 13.780],
                             [100.347, 13.791]
                        ]]
                    }
                }
            ]
        },
        district: {
             "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": { "name": "เขตพระนคร" },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[
                            [100.490, 13.748], [100.505, 13.765], [100.516, 13.758], [100.512, 13.745],
                            [100.498, 13.740], [100.490, 13.748]
                        ]]
                    }
                },
                {
                    "type": "Feature",
                    "properties": { "name": "เขตปทุมวัน" },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[
                            [100.512, 13.745], [100.530, 13.750], [100.540, 13.740], [100.525, 13.730],
                            [100.512, 13.745]
                        ]]
                    }
                },
                 {
                    "type": "Feature",
                    "properties": { "name": "เขตจตุจักร" },
                     "geometry": {
                        "type": "Polygon",
                        "coordinates": [[
                             [100.536, 13.805], [100.583, 13.856], [100.597, 13.834], [100.564, 13.802],
                             [100.552, 13.795], [100.536, 13.805]
                        ]]
                    }
                }
            ]
        }
    }
    ,
    USERS_LIST: [
        { id: 1, username: 'admin', name: 'Administrator', role: 'admin', division: 'ศทส.', group: 'ส่วนพัฒนาระบบ', avatar: 'https://ui-avatars.com/api/?name=Admin&background=ef4444&color=fff' },
        { id: 2, username: 'staff1', name: 'เจ้าหน้าที่ 1', role: 'staff', division: 'กวพ.', group: 'กลุ่มวิจัย 1', avatar: 'https://ui-avatars.com/api/?name=Staff+1&background=3b82f6&color=fff' },
        { id: 3, username: 'staff2', name: 'เจ้าหน้าที่ 2', role: 'staff', division: 'สบก.', group: 'งานธุรการ', avatar: 'https://ui-avatars.com/api/?name=Staff+2&background=10b981&color=fff' },
        { id: 4, username: 'user1', name: 'วิศวกร ชลประทาน', role: 'user', division: 'กวพ.', group: 'กลุ่มวิจัย 2', avatar: 'https://ui-avatars.com/api/?name=User+Thai&background=0D8ABC&color=fff' }
    ],
    TASKS: [
        { id: 1, title: 'ตรวจสอบข้อมูลน้ำฝน 2567', assignee_id: 2, deadline: '2026-02-01', status: 'pending', description: 'ตรวจสอบความถูกต้องของข้อมูลรายวัน' },
        { id: 2, title: 'อัปเดต Shapefile ลุ่มน้ำ', assignee_id: 2, deadline: '2026-01-25', status: 'in_progress', description: 'นำเข้าข้อมูลใหม่จากกรมที่ดิน และตรวจสอบความถูกต้องของ Topology' },
        { id: 3, title: 'สรุปรายงานประจำเดือน มกราคม', assignee_id: 3, deadline: '2026-01-31', status: 'completed', description: 'รวบรวมสถิติการใช้งานและการให้บริการข้อมูล' },
        { id: 4, title: 'แก้ไขปัญหา API ระดับน้ำ', assignee_id: 4, deadline: '2026-01-20', status: 'urgent', description: 'Service ล่มเมื่อวานช่วง 18.00 น.' }
    ],
    ASSESSMENTS: [
        { id: 1, staff_id: 2, score: 95, criteria: 'ความถูกต้อง', date: '2025-12-01' },
        { id: 2, staff_id: 2, score: 88, criteria: 'ความรวดเร็ว', date: '2025-12-01' },
        { id: 3, staff_id: 3, score: 92, criteria: 'ความร่วมมือ', date: '2025-12-05' }
    ]
};
