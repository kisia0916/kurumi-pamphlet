import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { connection_db } from '@/lib/astradb';

export async function GET() {
    try {
        const projects_data = await prisma.projects.findMany({
            include: {
                building: {
                    select: {
                        name: true,
                        index: true,
                    }
                },
                floor: {
                    select: {
                        floor_num: true,
                        floor_map_img: true,
                        toilets: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        const food_data = await prisma.foodData.findMany({
            include: {
                food_pace: {
                include: {
                project: {
                    include: {
                        building: {
                            select: {
                                name: true,
                                index: true,
                            }
                        },
                        floor: {
                            select: {
                                floor_num: true,
                            }
                        }
                    }
                    }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        const stamp_data = await prisma.stampPlace.findMany({
            include: {
                project: {
                    include: {
                        building: {
                            select: {
                                name: true,
                                index: true,
                            }
                        },
                        floor: {
                            select: {
                                floor_num: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        const event_data = await prisma.event_time.findMany({
            include: {
                project: {
                    include: {
                        building: {
                            select: {
                                name: true,
                            }
                        },
                        floor: {
                            select: {
                                floor_num: true,
                            }
                        }
                    }
                },
                event_space: {
                    select: {
                        name: true,
                    }
                },
                event_date: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        const db = connection_db()
        const collection = await db.collection("kurumi_data_01");

        const project_documents = projects_data.map((item: any) => {
            const { building, floor, ...rest } = item;
            return {
                ...rest,
                building_name: building?.name,
                floor_num: floor?.floor_num,
                type: "企画",
                createdAt: item.createdAt ? new Date(item.createdAt) : null,
                $vectorize: `name: ${item.name}| type: ${"企画"} | description: ${item.description} | project_genre: ${item.project_genre} | team_name: ${item.team_name} | room_name: ${item.room_name} | building: ${building?.name || ''} | floor: ${floor?.floor_num || ''}`,
            };
        });

        const food_documents = food_data.map((item: any) => {
            const { food_pace, status, ...rest } = item;
            const building = food_pace?.project?.building;
            const floor = food_pace?.project?.floor;
            const room_name = food_pace?.project?.room_name;
            
            return {
                ...rest,
                building_name: building?.name,
                floor_num: floor?.floor_num,
                room_name: room_name,
                place: food_pace?.place,
                type: "食品",
                createdAt: item.createdAt ? new Date(item.createdAt) : null,
                $vectorize: `name: ${item.name} | type: ${"食品"} | category: ${item.category} | price: ${item.price} | allergens: ${item.allergens?.join(', ') || ''} | place: ${food_pace?.place || ''} | room_name: ${room_name || ''} | building: ${building?.name || ''} | floor: ${floor?.floor_num || ''}`,
            };
        });

        const stamp_documents = stamp_data.map((item: any) => {
            const { project, ...rest } = item;
            const building = project?.building;
            const floor = project?.floor;
            const room_name = project?.room_name;
            
            return {
                ...rest,
                building_name: building?.name,
                floor_num: floor?.floor_num,
                room_name: room_name,
                type: "スタンプ",
                createdAt: item.createdAt ? new Date(item.createdAt) : null,
                $vectorize: `title: ${item.title} | type: ${"スタンプ"} | description: ${item.description} | room_name: ${room_name || ''} | building: ${building?.name || ''} | floor: ${floor?.floor_num || ''}`,
            };
        });

        const event_documents = event_data.map((item: any) => {
            const { project, event_space, event_date, ...rest } = item;
            const building = project?.building;
            const floor = project?.floor;
            const room_name = project?.room_name;
            
            return {
                ...rest,
                building_name: building?.name,
                floor_num: floor?.floor_num,
                room_name: room_name,
                event_space_name: event_space?.name,
                event_date_name: event_date?.name,
                type: "イベント",
                createdAt: item.createdAt ? new Date(item.createdAt) : null,
                $vectorize: `title: ${item.title} | type: ${"イベント"} | start_time: ${item.start_time} | end_time: ${item.end_time} | event_space: ${event_space?.name || ''} | event_date: ${event_date?.name || ''} | room_name: ${room_name || ''} | building: ${building?.name || ''} | floor: ${floor?.floor_num || ''}`,
            };
        });

        const documents = [...project_documents, ...food_documents, ...stamp_documents, ...event_documents];

        await collection.deleteMany({}); 
        // Insert the data
        const inserted = await collection.insertMany(documents);

        return NextResponse.json({ 
            success: true,
            inserted_count: inserted.insertedCount,
        }, { status: 200 })
    } catch (error) {
        console.error('Error fetching projects:', error)
        return NextResponse.json({ 
            success: false,
            error: 'Failed to fetch projects' 
        }, { status: 500 })
    }
}