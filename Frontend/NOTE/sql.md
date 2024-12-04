

> Tim kiem
```sql
db.actiondatas.find({
  device: "light1",
  action: "ON",
  time: "2024-11-26 20:27:24"
})
```

> Khoang thoi gian

``` sql
db.actiondatas.find({
  device: "light1",
  action: "ON",
  time: {
    $gte: "2024-11-20 00:00:00",
    $lte: "2024-11-26 23:59:59"
  }
})

```

> Tinh tong so phan tu

```sql
db.actiondatas.find().count()
```

> Sap xep 

```sql
db.actiondatas.find().sort({time: -1})
```

> Gioi han
```sql
db.actiondatas.find().sort({time: -1}).limit(5)
```

> Tim kiem tra ve nhieu truong doi tuong

```sql
db.actiondatas.aggregate([
  {
    $match: {
      device: { $in: ["light1", "light2", "light3"] }
    }
  },
  {
    $group: {
      _id: "$device",      // Nhóm theo trường device
      count: { $sum: 1 }    // Tính tổng số lượng tài liệu cho mỗi device
    }
  }
])
```

> Tim kiem bang `$match`

1. tim kiem duy nhat mot gia tri
```sql
db.actiondatas.aggregate(
{
  $match: {
    device:"light1"
    }
})

```


2. tim kiem co mot trong nhieu gia tri

```sql
db.actiondatas.aggregate(
{
  $match: {
    device:{
         $in: ["light1", "light2"] // kiem device co the la :"light1", hoac "light2"
      }
    }
})
```

3. tim kiem nhieu the loai
```sql
db.actiondatas.aggregate(
  { 
		$match: {
		device: "light1",
		action: "ON"	// kiem device = 'light1' va action= "ON"
}
 	}
)
```

4. Tinh tong dung `$match`

```sql
db.actiondatas.aggregate (
[
  {
		$match: {device: 'light1', action: "ON"}
	},
  {	
		$count: "count"
	}
]
)
```

5. Tim gioi han dung `$match`


```sql
db.actiondatas.aggregate (
[
  {
		$match: {device: 'light1', action: "ON"}
	},
  {	
	 $limit: 5
	}

]
)
```


6. Sap xep dung `$match`

```sql
db.actiondatas.aggregate (
[
  {
		$match: {device: 'light1', action: "ON"}
	},
  {	
	   $limit: 5
	},
  {
    $sort: {time: -1}
  }

]
)
```


7. Tim kiem khoang co dung `$match`

```sql
db.actiondatas.aggregate (
[
  {
		$match: 
      {
          device: 'light1',
          action: "ON", 
		      time: {
              $gte: "2024-01-01",
              $lte: "2024-12-11"
            }
		}
	},
  {	
	 $limit: 5
	},
  {
    $sort: {time: -1}
  }

]
)
```

8. Tinh tong cac truong phan loai dung `$match`

```sql
db.actiondatas.aggregate(
[
  {
		$match: {
			device: "light1",
			action: {$in: ["ON", "OFF"			]}
		},
  },
  {
		$group: {
			_id: "$action",
			count: {$sum: 1} 
		}
	}
]

)

-----------------------------------------

db.actiondatas.aggregate(
[
  {
		$match: {
			device: {$in: ["light1","light2"]},
			action: {$in: ["ON", "OFF"			]}
		},
  },
  {
		$group: {
			_id: "$action",
			count: {$sum: 1} 
		}
	}
]

)

-----------------------------------------

db.actiondatas.aggregate(
[
  {
		$match: {
			device: {$in: ["light1","light2"]},
			action: {$in: ["ON", "OFF"			]}
		},
  },
  {
		$group: {
			_id: {
				 d: "$device", a:"$action"	
			},
			count: {$sum: 1} 
		}
	}
]

)

------------------------VIP

db.actiondatas.aggregate(
[
  { 
		$match:
			{
					device:  {$in: ["light1", "light2"]},
					action:  {$in: ["ON", "OFF"]}
			}
	},
  {
		$group: 
      {
					_id: 
					{
							dev: "$device",
							ac: "$action"
          },
					tong: {$sum: 1} 
			}
	}
 ]
)

```


10. Tim gia tri nho nhat theo nhom trong `$match` va `$group`

```sql

db.actiondatas.aggregate(
[
  {
		$match: 
		{
				device: {$in:['light1', "light2"]}
		}
	},
  {
		$group: {
				_id: "$device",
				_min: {$min: "$time"}
		}
    // gia tri nho nhat cua thoi gian khi nhom theo cac nhom device
	}

]
)

```

12. Tinh toan theo gia tri `$match` da `$group `
 
```sql
db.actiondatas.aggregate(
[
  {
		$match: 
		{
				device: {$in:['light1', "light2", "light3"]}
		}
	},
  {
		$group: {
				_id: "$device",
				_sum: {$sum: 1}
		}
	},
  {
		$sort: {_sum: 1}
	}
]
)
```


> Tim kiem moi truong co the co bao nhieu loai gia tri xay ra khac nhau

```sql

db.sensordatas.aggregate(
[
  {
		$group: 
      {
				_id: "$temperature",
				_sum: {$sum: 1}
			}	
	}
]
)
```



> `VD`: Tim so lan xuat hien cua gia tri cao nhat trong mot loai

```sql

db.sensordatas.aggregate(
[
  {
			$group: 
        {
						_id: "$temperature",
						_sum: {$sum: 1}
				}
	},
  {
			$sort: {_id: -1}
	},
  { 
		$limit: 1
	}

])


```


> `VD`: Tim so gia tri cua moi loai thuoc tinh

```sql
db.sensordatas.aggregate([
  {
    $facet: {
      "temperature": [{ $group: { _id: "$temperature" } }],
      "humidity": [{ $group: { _id: "$humidity" } }],
      "light": [{ $group: { _id: "$light" } }],
      "wind": [{ $group: { _id: "$wind" } }],
      "wind1": [{ $group: { _id: "$wind1" } }],
      "wind2": [{ $group: { _id: "$wind2" } }]
    }
  },
  {
    $project: {
      "temperatureCount": { $size: "$temperature" },
      "humidityCount": { $size: "$humidity" },
      "lightCount": { $size: "$light" },
      "windCount": { $size: "$wind" },
      "wind1Count": { $size: "$wind1" },
      "wind2Count": { $size: "$wind2" }
    }
  }
])
```




### `$match`: Dung tim kiem
### `$group`: Ghep noi du lieu thanh thuc the moi 
### `$count`: Tim tong cac gia tri
### `$facet`: Thuc hien nhieu phep tinh trong cung bang du lieu 
### `$project`: Tao, them, loai bo, giu lai cac truong