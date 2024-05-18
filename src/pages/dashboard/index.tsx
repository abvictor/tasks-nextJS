import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'

import { FiShare2 } from 'react-icons/fi'
import { TextArea } from '@/components/textarea'

import { FaTrash } from 'react-icons/fa'

import styles from './styles.module.css'

import { db } from '@/services/firebaseConnection'
import { addDoc, collection, query, orderBy, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore'
import Link from 'next/link'


interface DashboardProps {
    user: {
        email: string;
    }
}

interface TasksProps{
    id: string;
    created: Date;
    public: boolean;
    task: string;
    user: string;
}

export default function Dashboard({ user }:DashboardProps){
    const [input, setInput] = useState("")
    const [publicTask, setPublicTask] = useState(false);

    const [tasks, setTasks] = useState<TasksProps[]>([])


    function handleChangePublic(e: ChangeEvent<HTMLInputElement>){
        setPublicTask(e.target.checked)
    }

    async function handleRegisterTask(e: FormEvent){
        e.preventDefault()

        if(input === '') return;

        try{
            await addDoc(collection(db, "tasks"), {
                task: input,
                created: new Date(),
                user: user?.email,
                public: publicTask
            })
        }catch(err){
            console.log(err)
        }

        setInput("")
        setPublicTask(false)
    }


    useEffect(() => {
        async function loadTasks(){
            const tarefasRef = collection(db, "tasks")
            const q = query(
                tarefasRef,
                orderBy("created", "desc"),
                where("user", "==", user?.email)
            )

           onSnapshot(q, (snapshot) => {
                let lista = [] as TasksProps[];

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        task: doc.data().task,
                        created: doc.data().created,
                        user: doc.data().user,
                        public: doc.data().public
                    })
                })
                setTasks(lista)
           })
        }
        loadTasks()

        console.log(tasks)
    },[user?.email])



    async function handleShare(id: string){
        await navigator.clipboard.writeText(
            `${process.env.NEXT_PUBLIC_URL}/task/${id}`
        )
    }


    async function handleDeleteTask(id: string){
        const docRef = doc(db, "tasks", id)

        await deleteDoc(docRef)
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Meu painel de tarefas</title>
            </Head>

            <main className={styles.main}>
                <section className={styles.content}>
                    <div className={styles.contentForm}>
                        <h1 className={styles.title}>Qual a sua tarefa?</h1>
                        
                        <form onSubmit={handleRegisterTask}>
                            <TextArea placeholder='Digite qual é sua tarefa...' value={input} onChange={(e:ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}/>
                            <div className={styles.checkboxArea}>
                                <input type="checkbox" className={styles.checkbox} checked={publicTask} onChange={handleChangePublic}/>
                                <label>Deixar tarefa pública?</label>
                            </div>
                            <button className={styles.button} type='submit'>Registrar</button>
                        </form>
                    </div>
                </section>

                <section className={styles.taskContainer}>
                    <h2>Minhas tarefas</h2>
                    
                    {tasks.map((task) => (
                        <article className={styles.task} key={task.id}>
                        {task.public && (
                            <div className={styles.tagContainer}>
                                <label className={styles.tag}>PÚBLICO</label>
                                <button className={styles.shareButton} onClick={() => handleShare(task.id)}><FiShare2 size={22} color="#3183ff"/></button>
                            </div>
                        )}

                        <div className={styles.taskContent}>
                            {task.public ? (
                              <Link href={`/task/${task.id}`}>
                                <p>{task.task}</p>
                              </Link>
                            ) : (
                                 <p>{task.task}</p>
                               )
                            }
                            <button className={styles.trashButton} onClick={() => handleDeleteTask(task.id)}><FaTrash size={24} color="#ea3140"/></button>
                        </div>
                    </article>
                    ))}
                </section>
            </main>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req}) => {
    const session = await getSession({req})
    
    if(!session?.user){
        return{
            redirect:{
                destination: "/",
                permanent: false
            }
        }
    }
    
    return {
        props: {
            user: {
                email: session.user.email
            }
        }
    }
}